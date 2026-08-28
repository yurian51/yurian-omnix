ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_tenant_isolation ON customers USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY products_tenant_isolation ON products USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY orders_tenant_isolation ON orders USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY order_items_tenant_isolation ON order_items USING (tenant_id::text = current_setting('app.tenant_id', true));
