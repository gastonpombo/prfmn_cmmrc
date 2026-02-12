-- ============================================
-- Función para decrementar stock de forma segura
-- ============================================
-- Esta función maneja la resta de stock de forma atómica
-- evitando race conditions cuando múltiples pagos se procesan simultáneamente

CREATE OR REPLACE FUNCTION decrement_product_stock(
  product_id bigint,
  quantity integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar el stock usando una operación atómica
  UPDATE products
  SET
    stock = GREATEST(stock - quantity, 0), -- No permitir stock negativo
    updated_at = now()
  WHERE id = product_id;

  -- Verificar si el producto existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % no encontrado', product_id;
  END IF;
END;
$$;

-- ============================================
-- Función alternativa que devuelve el nuevo stock
-- ============================================
CREATE OR REPLACE FUNCTION decrement_product_stock_with_result(
  product_id bigint,
  quantity integer
)
RETURNS TABLE(
  old_stock integer,
  new_stock integer,
  product_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_stock integer;
  v_new_stock integer;
  v_product_name text;
BEGIN
  -- Obtener stock actual
  SELECT stock, name INTO v_old_stock, v_product_name
  FROM products
  WHERE id = product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % no encontrado', product_id;
  END IF;

  -- Calcular nuevo stock (no permitir negativo)
  v_new_stock := GREATEST(v_old_stock - quantity, 0);

  -- Actualizar
  UPDATE products
  SET
    stock = v_new_stock,
    updated_at = now()
  WHERE id = product_id;

  -- Retornar resultado
  RETURN QUERY SELECT v_old_stock, v_new_stock, v_product_name;
END;
$$;

-- ============================================
-- Grants para permitir que el webhook use estas funciones
-- ============================================
-- El SERVICE_ROLE_KEY ya tiene permisos, pero por si acaso:
GRANT EXECUTE ON FUNCTION decrement_product_stock(bigint, integer) TO service_role;
GRANT EXECUTE ON FUNCTION decrement_product_stock_with_result(bigint, integer) TO service_role;

-- ============================================
-- Ejemplo de uso:
-- ============================================
-- SELECT decrement_product_stock(1, 2); -- Resta 2 unidades al producto 1
-- SELECT * FROM decrement_product_stock_with_result(1, 2); -- Retorna old/new stock

-- ============================================
-- Para ejecutar esta función en Supabase:
-- ============================================
-- 1. Ve a SQL Editor en tu dashboard de Supabase
-- 2. Copia y pega este código
-- 3. Haz clic en "Run"
