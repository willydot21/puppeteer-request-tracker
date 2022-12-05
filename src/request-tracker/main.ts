import { Page } from "puppeteer";
import { RequestStack } from "../../@types/request-tracker";
import TrackerQueue from "./tracker-queue";

export default class RequestTracker {

  private page: Page;
  private trackerQueue = new TrackerQueue();

  constructor(page: Page) {
    this.page = page;
  }

  public async build() {
    await this.trackerQueue.build(this.page);
  }

  public getStack() {
    return this.trackerQueue.getFinished();
  }

  public getPending() {
    return this.trackerQueue.getPending();
  }

}