-- ============================================
-- Función RPC para decrementar stock atómicamente
-- ============================================
-- Esta función previene race conditions cuando múltiples
-- usuarios compran el mismo producto simultáneamente

CREATE OR REPLACE FUNCTION decrement_stock(
  row_id bigint,
  quantity_to_subtract int
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar el stock usando operación atómica
  UPDATE products
  SET
    stock = GREATEST(stock - quantity_to_subtract, 0),  -- No permitir stock negativo
    updated_at = now()
  WHERE id = row_id;

  -- Verificar que el producto exista
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % no encontrado', row_id;
  END IF;
END;
$$;

-- ============================================
-- Grants para permitir que el webhook use esta función
-- ============================================
GRANT EXECUTE ON FUNCTION decrement_stock(bigint, int) TO service_role;
GRANT EXECUTE ON FUNCTION decrement_stock(bigint, int) TO anon;
GRANT EXECUTE ON FUNCTION decrement_stock(bigint, int) TO authenticated;

-- ============================================
-- Función alternativa con validación de stock
-- ============================================
-- Esta versión valida que haya stock suficiente antes de decrementar

CREATE OR REPLACE FUNCTION decrement_stock_safe(
  row_id bigint,
  quantity_to_subtract int
)
RETURNS TABLE(
  success boolean,
  old_stock int,
  new_stock int,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_stock int;
  v_new_stock int;
  v_product_name text;
BEGIN
  -- Obtener stock actual
  SELECT stock, name INTO v_old_stock, v_product_name
  FROM products
  WHERE id = row_id
  FOR UPDATE;  -- Lock la fila para evitar race conditions

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 0, 'Producto no encontrado'::text;
    RETURN;
  END IF;

  -- Validar stock suficiente
  IF v_old_stock < quantity_to_subtract THEN
    RETURN QUERY SELECT
      false,
      v_old_stock,
      v_old_stock,
      format('Stock insuficiente. Disponible: %s, solicitado: %s', v_old_stock, quantity_to_subtract)::text;
    RETURN;
  END IF;

  -- Calcular nuevo stock
  v_new_stock := v_old_stock - quantity_to_subtract;

  -- Actualizar
  UPDATE products
  SET
    stock = v_new_stock,
    updated_at = now()
  WHERE id = row_id;

  -- Retornar éxito
  RETURN QUERY SELECT
    true,
    v_old_stock,
    v_new_stock,
    format('Stock actualizado: %s → %s', v_old_stock, v_new_stock)::text;
END;
$$;

-- Grants para la versión safe
GRANT EXECUTE ON FUNCTION decrement_stock_safe(bigint, int) TO service_role;
GRANT EXECUTE ON FUNCTION decrement_stock_safe(bigint, int) TO anon;
GRANT EXECUTE ON FUNCTION decrement_stock_safe(bigint, int) TO authenticated;

-- ============================================
-- Ejemplos de uso:
-- ============================================

-- Uso básico:
-- SELECT decrement_stock(1, 2);  -- Resta 2 unidades al producto 1

-- Uso con validación:
-- SELECT * FROM decrement_stock_safe(1, 2);
-- Retorna: (success, old_stock, new_stock, message)

-- ============================================
-- Verificar que las funciones se crearon correctamente:
-- ============================================
-- SELECT proname, prosrc FROM pg_proc WHERE proname LIKE 'decrement_stock%';

-- ============================================
-- INSTRUCCIONES:
-- ============================================
-- 1. Ve a Supabase Dashboard > SQL Editor
-- 2. Copia y pega este código completo
-- 3. Haz clic en "Run"
-- 4. Verifica que no haya errores
-- 5. Las funciones estarán disponibles para usar en el webhook
