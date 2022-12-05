import { HTTPRequest, Page } from "puppeteer";
import { PausedRequestHandler, PendingQueue, RequestStack } from "../../@types/request-tracker";
import { getRequestInfo } from "./utils";

export default class TrackerQueue {

  private pendingQueue = [] as PendingQueue;
  private finished = [] as RequestStack;
  private paused = false;

  public async build(page: Page) {

    page.setDefaultNavigationTimeout(0)
    await page.setRequestInterception(true);

    page.on('request', request =>
      this.onRequest(request));

    page.on('requestfinished', request =>
      this.onRequestFinished(request));

    page.on('requestfailed', () =>
      this.onRequestFailed());

    return this;
  }

  public getPending() { return this.pendingQueue; }

  public getFinished() { return this.finished; }

  public isPaused() { return this.paused; }

  private nextRequest() {

    const isPendingEmpty = this.pendingQueue.length === 0;

    if (!isPendingEmpty) {
      const doNextRequest = this.pendingQueue.shift() as PausedRequestHandler; // it's always not empty.
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

    this.pendingQueue.push(() => request.continue());

  }

  private async onRequestFinished(request: HTTPRequest) {

    const requestInfo = await getRequestInfo(request);
    this.finished.push(requestInfo);

    this.nextRequest();

  }

  private onRequestFailed() { this.nextRequest(); }

}

/*
  reference:
    https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag
*/