ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_customer_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_customer_tenant_fk FOREIGN KEY (tenant_id, customer_id) REFERENCES customers(tenant_id,id);
ALTER TABLE order_items ADD CONSTRAINT order_items_product_tenant_fk FOREIGN KEY (tenant_id, product_id) REFERENCES products(tenant_id,id);
ALTER TABLE order_items ADD CONSTRAINT order_items_order_tenant_fk FOREIGN KEY (tenant_id, order_id) REFERENCES orders(tenant_id,id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS customers_tenant_id_unique ON customers(tenant_id,id);
CREATE UNIQUE INDEX IF NOT EXISTS products_tenant_id_unique ON products(tenant_id,id);
CREATE UNIQUE INDEX IF NOT EXISTS orders_tenant_id_unique ON orders(tenant_id,id);
