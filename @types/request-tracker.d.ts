
export interface IRequestInfo {
  url: string;
  requestHeaders: Record<string, string>;
  requestPostData: string | null;
  responseHeaders: Record<string, string> | null;
  responseSize: number | null;
  responseBody: Buffer | null;
}

export type PausedRequestHandler = () => Promise<void>;
export type PendingQueue = PausedRequestHandler[];
export type RequestStack = IRequestInfo[];

export type NotifyHandler = () => Promise<void> | void;