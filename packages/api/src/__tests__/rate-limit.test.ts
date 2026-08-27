import { rateLimitKey } from "../rate-limit";
describe("rate limit key",()=>{it("isolates tenants and users by route",()=>{expect(rateLimitKey("t1","u1","orders")).toBe("t1:u1:orders");expect(rateLimitKey("t2","u1","orders")).not.toBe(rateLimitKey("t1","u1","orders"));expect(rateLimitKey("t1","u2","orders")).not.toBe(rateLimitKey("t1","u1","orders"));});});
