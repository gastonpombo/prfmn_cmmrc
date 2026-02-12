-- ============================================
-- Políticas RLS para PerfuMan E-commerce
-- ============================================

-- 1. Habilitar RLS en las tablas
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORDERS: Políticas
-- ============================================

-- Permitir INSERT a usuarios anónimos (anon)
-- Esto permite crear órdenes sin estar logueado
CREATE POLICY "anon_can_insert_orders"
ON orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Permitir SELECT solo a usuarios autenticados que sean admins
-- Nota: Requiere una columna 'role' en auth.users o usar una tabla de roles
CREATE POLICY "admin_can_select_all_orders"
ON orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Permitir a usuarios autenticados ver sus propias órdenes
CREATE POLICY "users_can_select_own_orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Permitir a admins actualizar cualquier orden
CREATE POLICY "admin_can_update_orders"
ON orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- ORDER_ITEMS: Políticas
-- ============================================

-- Permitir INSERT a usuarios anónimos
CREATE POLICY "anon_can_insert_order_items"
ON order_items
FOR INSERT
TO anon
WITH CHECK (true);

-- Permitir SELECT a admins de todos los items
CREATE POLICY "admin_can_select_all_order_items"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Permitir a usuarios ver los items de sus propias órdenes
CREATE POLICY "users_can_select_own_order_items"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- ============================================
-- PRODUCTS: Políticas (READ-ONLY para todos)
-- ============================================

-- Permitir SELECT a todos (anon y authenticated) para ver productos
CREATE POLICY "everyone_can_select_products"
ON products
FOR SELECT
TO anon, authenticated
USING (true);

-- Solo admins pueden INSERT/UPDATE/DELETE productos
CREATE POLICY "admin_can_manage_products"
ON products
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- ============================================
-- FUNCIÓN HELPER: Verificar si un usuario es admin
-- ============================================

-- Crear una función para verificar roles de manera más limpia
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ALTERNATIVA: Si usas una tabla separada de roles
-- ============================================

-- Si prefieres usar una tabla 'user_roles' en lugar de metadata:
/*
CREATE TABLE user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Permitir a usuarios ver solo su propio rol
CREATE POLICY "users_can_view_own_role"
ON user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Solo admins pueden gestionar roles
CREATE POLICY "admins_can_manage_roles"
ON user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Función helper actualizada
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
*/

-- ============================================
-- VERIFICACIÓN: Queries para testear las políticas
-- ============================================

-- Verificar políticas existentes:
-- SELECT * FROM pg_policies WHERE tablename IN ('orders', 'order_items', 'products');

-- Testear INSERT como anon:
-- SET ROLE anon;
-- INSERT INTO orders (total_amount, status, customer_details) VALUES ...;

-- Testear SELECT como admin:
-- SET ROLE authenticated;
-- SELECT * FROM orders; -- Debería funcionar solo si el usuario es admin
