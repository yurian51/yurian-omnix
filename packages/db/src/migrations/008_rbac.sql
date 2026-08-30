CREATE TABLE IF NOT EXISTS roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(tenant_id,name));
CREATE TABLE IF NOT EXISTS permissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS role_permissions (role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE, permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE, PRIMARY KEY(role_id,permission_id));
CREATE TABLE IF NOT EXISTS user_roles (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE, PRIMARY KEY(user_id,role_id));
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY roles_tenant_isolation ON roles USING (tenant_id::text=current_setting('app.tenant_id',true));
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
