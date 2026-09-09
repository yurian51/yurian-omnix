# Production PostgreSQL

YURIAN AI OS requires a dedicated PostgreSQL database. Do not reuse another product's database.

Required sequence:
1. Provision a dedicated Render PostgreSQL instance.
2. Configure DATABASE_URL as a managed secret.
3. Run Prisma migrations.
4. Verify schema and extensions.
5. Run readiness checks.
6. Only then promote the API to production.

If the Render account requires billing for the selected database plan, provisioning must stop until billing is configured. Never substitute another application's database.
