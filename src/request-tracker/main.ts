import { Page } from 'puppeteer';
import TrackerEventController from './tracker-event-controller';
import TrackerQueue from './tracker-queue';

export default class RequestTracker {

  private page: Page;
  private trackerQueue = new TrackerQueue();
  private trackerEventController = new TrackerEventController(this.trackerQueue);

  constructor(page: Page) {
    this.page = page;
  }

  public notify() {

    // We need that tracker queue emit 
    // an event to capture each change
    // on queue lists.

  }

  public async build() {

    await this.trackerEventController
      .build(this.page);

  }

  public getStack() {
    return this.trackerQueue.getFinished();
  }

  public getPending() {
    return this.trackerQueue.getPending();
  }

}