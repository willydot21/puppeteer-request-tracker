
export interface IRequestInfo {
  url: string;
  requestHeaders: Record<string, string>;
  requestPostData: string | null;
  responseHeaders: Record<string, string> | null;
  responseSize: number | null;
  responseBody: Buffer | null;
}

export type PausedRequestHandler = () => Promise<void>;
export type RequestQueue = PausedRequestHandler[];
export type RequestStack = IRequestInfo[];