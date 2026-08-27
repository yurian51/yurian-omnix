import { matchRoute } from "../route-matcher";
describe("matchRoute",()=>{it("matches parameterized routes",()=>{expect(matchRoute("/api/v1/orders/:id","/api/v1/orders/ord_123")).toEqual({id:"ord_123"});});it("rejects unrelated paths",()=>{expect(matchRoute("/api/v1/orders/:id","/api/v1/customers/1")).toBeNull();});});
