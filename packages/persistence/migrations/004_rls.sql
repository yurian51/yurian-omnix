-- RLS is enabled as a defense-in-depth layer. Application transactions must set app.tenant_id before accessing tenant data.
ALTER TABLE whatsapp_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_whatsapp_channels ON whatsapp_channels USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_customers ON customers USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_conversations ON conversations USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_messages ON messages USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_products ON products USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_orders ON orders USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_order_items ON order_items USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_payments ON payments USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_tickets ON tickets USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_ai_agents ON ai_agents USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_ai_memories ON ai_memories USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_workflow_executions ON workflow_executions USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE POLICY tenant_isolation_audit_events ON audit_events USING (tenant_id::text = current_setting('app.tenant_id', true));
