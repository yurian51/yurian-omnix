import { Readable } from "node:stream";
import { readJsonBody } from "../http-json";
describe("readJsonBody",()=>{it("parses valid JSON",async()=>{const req=Readable.from(['{"ok":true}']);await expect(readJsonBody(req as any)).resolves.toEqual({ok:true});});it("rejects malformed JSON",async()=>{const req=Readable.from(["{bad"]);await expect(readJsonBody(req as any)).rejects.toThrow("Invalid JSON body");});it("enforces body limit",async()=>{const req=Readable.from(["12345"]);await expect(readJsonBody(req as any,3)).rejects.toThrow("Request body too large");});});
