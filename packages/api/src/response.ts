import type { ServerResponse } from "node:http";
import type { ControllerResult } from "./controller-types";
export function writeJson<T>(res:ServerResponse,result:ControllerResult<T>){const body=JSON.stringify(result.body);res.statusCode=result.status;res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Content-Length",Buffer.byteLength(body));res.end(body);}
