import { isOriginAllowed } from "../cors";
describe("CORS",()=>{it("allows configured origin",()=>{expect(isOriginAllowed("https://app.example.com",{origins:["https://app.example.com"],methods:[],headers:[]})).toBe(true);});it("rejects unconfigured origin",()=>{expect(isOriginAllowed("https://evil.example.com",{origins:["https://app.example.com"],methods:[],headers:[]})).toBe(false);});});
