# Render Deployment

YURIAN AI OS API is deployed from main. Runtime secrets belong in Render environment variables, never in Git.

Verification sequence:
1. frozen-lockfile install
2. typecheck
3. tests
4. production build
5. API startup
6. health verification
7. PostgreSQL connection
8. Redis connection
