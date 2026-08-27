CREATE INDEX idx_channels_tenant_status ON whatsapp_channels(tenant_id, status);
CREATE INDEX idx_customers_tenant_status ON customers(tenant_id, status);
CREATE INDEX idx_messages_tenant_status ON messages(tenant_id, status, occurred_at DESC);
CREATE INDEX idx_audit_events_resource ON audit_events(tenant_id, resource_type, resource_id, occurred_at DESC);

ALTER TABLE messages ADD CONSTRAINT chk_messages_direction CHECK (direction IN ('INBOUND','OUTBOUND'));
ALTER TABLE messages ADD CONSTRAINT chk_messages_status CHECK (status IN ('RECEIVED','QUEUED','SENT','DELIVERED','READ','FAILED'));
ALTER TABLE conversations ADD CONSTRAINT chk_conversations_status CHECK (status IN ('OPEN','CLOSED'));
