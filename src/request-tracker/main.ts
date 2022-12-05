import { HTTPRequest, Page } from "puppeteer";
import { PausedRequestHandler, RequestQueue, RequestStack } from "../../@types/request-tracker";
import { getRequestInfo } from "./utils";

export default class RequestTracker {

  private page: Page;
  public requestQueue = [] as RequestQueue;
  public requestStack = [] as RequestStack;
  public paused = false;

  constructor(page: Page) {
    this.page = page;
  }

  public async build() {

    await this.page.setRequestInterception(true);

    this.page.on('request', request =>
      this.onRequest(request));

    this.page.on('requestfinished', request =>
      this.onRequestFinished(request));

    this.page.on('requestfailed', () =>
      this.onRequestFailed());

  }

  private nextRequest() {

    const emptyRequestQueue = this.requestQueue.length === 0;

    if (!emptyRequestQueue) {
      const doNextRequest = this.requestQueue.shift() as PausedRequestHandler; // it's always not empty.
      doNextRequest();
      return;
    }

    this.paused = false;

  }

  private onRequest(request: HTTPRequest) {

    if (!this.paused) {
      this.paused = true;
      request.continue();
      return;
    }

    this.requestQueue.push(() => request.continue());

  }

  private async onRequestFinished(request: HTTPRequest) {

    const requestInfo = await getRequestInfo(request);
    this.requestStack.push(requestInfo);

    this.nextRequest();

  }

  private onRequestFailed() { this.nextRequest(); }

}

/*
  reference:
    https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag
*/