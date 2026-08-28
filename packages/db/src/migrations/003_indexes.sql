CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON orders(tenant_id,status);
CREATE INDEX IF NOT EXISTS idx_order_items_tenant_order ON order_items(tenant_id,order_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_stock ON products(tenant_id,stock);
