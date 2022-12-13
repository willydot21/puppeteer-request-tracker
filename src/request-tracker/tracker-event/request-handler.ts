import { HTTPRequest } from "puppeteer";
import TrackerQueue from "../tracker-queue";
import { getRequestInfo } from "../utils";

export default class ControllerRequestHandler {

  private trackerQueue: TrackerQueue;

  constructor(trackerQueueInstance: TrackerQueue) {
    this.trackerQueue = trackerQueueInstance;
  }

  private nextRequest() {

    const pending = this.trackerQueue.getPending();
    const pendingEmpty = pending.length === 0;

    if (!pendingEmpty) {
      return this.trackerQueue.nextPending();
    }

    this.trackerQueue.updatePaused(false);

  }

  public onRequest(request: HTTPRequest) {

    const isPaused = this.trackerQueue.isPaused();

    if (!isPaused) {
      this.trackerQueue.updatePaused(true);
      return request.continue();
    }

    this.trackerQueue.updatePending(
      () => request.continue());

  }

  public async onRequestFinished(request: HTTPRequest) {

    const requestInfo = await getRequestInfo(request);
    this.trackerQueue.updateFinished(requestInfo);

    this.nextRequest();

  }

  public onRequestFailed() { this.nextRequest(); }

}
