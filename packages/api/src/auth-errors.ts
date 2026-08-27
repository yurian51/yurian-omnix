export class AuthenticationError extends Error { readonly code = "AUTHENTICATION_REQUIRED"; constructor(message = "Authentication required") { super(message); this.name = "AuthenticationError"; } }
export class AuthorizationError extends Error { readonly code = "FORBIDDEN"; constructor(message = "Forbidden") { super(message); this.name = "AuthorizationError"; } }
