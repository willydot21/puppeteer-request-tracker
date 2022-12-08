import { HTTPRequest, Page } from "puppeteer";
import { PausedRequestHandler, PendingQueue, RequestStack } from "../../@types/request-tracker";
import RequestTracker from "./main";
import TrackerQueue from "./tracker-queue";
import { getRequestInfo } from "./utils";

export default class TrackerEventController {

  private trackerQueue: TrackerQueue;

  constructor(queueInstance: TrackerQueue) {
    this.trackerQueue = queueInstance;
  }

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

  private nextRequest() {

    const pending = this.trackerQueue.getPending();
    const isPendingEmpty = pending.length === 0;

    if (!isPendingEmpty) {
      return this.trackerQueue.nextPending();
    }

    this.trackerQueue.updatePaused(false);

  }

  private onRequest(request: HTTPRequest) {

    const isPaused = this.trackerQueue.isPaused();

    if (!isPaused) {
      this.trackerQueue.updatePaused(true);
      return request.continue();
    }

    this.trackerQueue.updatePending(
      () => request.continue());

  }

  private async onRequestFinished(request: HTTPRequest) {

    const requestInfo = await getRequestInfo(request);
    this.trackerQueue.updateFinished(requestInfo);

    this.nextRequest();

  }

  private onRequestFailed() { this.nextRequest(); }

}

/*
  reference:
    https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag
*/