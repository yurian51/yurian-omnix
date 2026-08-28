CREATE TABLE IF NOT EXISTS payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE, amount numeric(18,2) NOT NULL CHECK(amount >= 0), currency text NOT NULL DEFAULT 'TZS', status text NOT NULL DEFAULT 'PENDING', provider text, provider_reference text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS inventory_reservations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id), quantity integer NOT NULL CHECK(quantity > 0), status text NOT NULL DEFAULT 'RESERVED', created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_payments_tenant_order ON payments(tenant_id,order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_reservations_tenant_order ON inventory_reservations(tenant_id,order_id);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_tenant_isolation ON payments USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY inventory_reservations_tenant_isolation ON inventory_reservations USING (tenant_id::text = current_setting('app.tenant_id', true));
