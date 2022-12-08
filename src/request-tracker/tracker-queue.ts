import { IRequestInfo, PausedRequestHandler, PendingQueue, RequestStack } from "../../@types/request-tracker";

export default class TrackerQueue {

  private pendingQueue = [] as PendingQueue;
  private finished = [] as RequestStack;
  private paused = false;

  public getPending() { return this.pendingQueue; }

  public getFinished() { return this.finished; }

  public isPaused() { return this.paused; }

  public updatePending(pausedHandler: PausedRequestHandler) {
    this.pendingQueue.push(pausedHandler);
  }

  public nextPending() {
    const doNextPending = this.pendingQueue.shift() as PausedRequestHandler;
    doNextPending();
  }

  public updateFinished(requestInfo: IRequestInfo) {
    this.finished.push(requestInfo);
  }

  public updatePaused(paused: boolean) {
    this.paused = paused;
  }

}