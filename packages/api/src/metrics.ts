export type RequestMetric={route:string;method:string;status:number;durationMs:number;timestamp:string};
export class RequestMetrics { private readonly values:RequestMetric[]=[]; record(metric:RequestMetric){this.values.push(metric);if(this.values.length>1000)this.values.shift();} snapshot(){return this.values.slice();} }
