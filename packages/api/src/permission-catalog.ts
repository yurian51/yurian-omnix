export const PERMISSIONS={customersRead:"customers:read",customersWrite:"customers:write",productsRead:"products:read",productsWrite:"products:write",ordersRead:"orders:read",ordersWrite:"orders:write",paymentsRead:"payments:read",paymentsWrite:"payments:write",inventoryRead:"inventory:read",inventoryWrite:"inventory:write",usersRead:"users:read",usersWrite:"users:write"} as const;
export type PermissionKey=typeof PERMISSIONS[keyof typeof PERMISSIONS];
export const permissionCatalog:readonly PermissionKey[]=Object.values(PERMISSIONS);
