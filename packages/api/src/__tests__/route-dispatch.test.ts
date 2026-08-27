import { dispatch } from "../route-dispatch";
describe("route dispatch",()=>{it("resolves known routes",()=>{expect(dispatch("POST","/api/v1/orders")).toMatchObject({route:{handler:"orders.create"}});});it("returns null for unknown routes",()=>{expect(dispatch("GET","/api/v1/unknown")).toBeNull();});});
