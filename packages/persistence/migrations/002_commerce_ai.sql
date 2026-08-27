CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL, sku text, price numeric(18,2) NOT NULL CHECK (price >= 0), currency char(3) NOT NULL, stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0), active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, sku)
);
CREATE INDEX idx_products_tenant_active_name ON products(tenant_id, active, name);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT, subtotal numeric(18,2) NOT NULL CHECK (subtotal >= 0), total numeric(18,2) NOT NULL CHECK (total >= 0), currency char(3) NOT NULL,
  status text NOT NULL DEFAULT 'PENDING', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_tenant_customer_created ON orders(tenant_id, customer_id, created_at DESC);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0), unit_price numeric(18,2) NOT NULL CHECK (unit_price >= 0), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order ON order_items(tenant_id, order_id);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE, amount numeric(18,2) NOT NULL CHECK (amount >= 0), currency char(3) NOT NULL,
  status text NOT NULL DEFAULT 'PENDING', provider_reference text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, provider_reference)
);
CREATE INDEX idx_payments_order ON payments(tenant_id, order_id, created_at DESC);

CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT, title text NOT NULL, priority text NOT NULL DEFAULT 'NORMAL', status text NOT NULL DEFAULT 'OPEN',
  assigned_agent_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tickets_customer_status ON tickets(tenant_id, customer_id, status, updated_at DESC);

CREATE TABLE ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL, status text NOT NULL DEFAULT 'ACTIVE', max_tool_calls integer NOT NULL DEFAULT 10 CHECK (max_tool_calls > 0), allowed_variables jsonb NOT NULL DEFAULT '[]'::jsonb, allowed_tools jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE (tenant_id, name)
);

CREATE TABLE ai_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE, agent_id uuid REFERENCES ai_agents(id) ON DELETE CASCADE,
  content text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_memories_customer_updated ON ai_memories(tenant_id, customer_id, updated_at DESC);

CREATE TABLE workflow_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id uuid NOT NULL, status text NOT NULL, started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, error text
);
CREATE INDEX idx_workflow_executions_tenant_started ON workflow_executions(tenant_id, started_at DESC);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_type text NOT NULL, actor_id uuid, action text NOT NULL, resource_type text, resource_id uuid, outcome text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}'::jsonb, occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_events_tenant_occurred ON audit_events(tenant_id, occurred_at DESC);
