import { Page } from "puppeteer";
import TrackerEvents from "./events";

export default class RequestTracker {

  private page: Page;
  private trackerEvents: TrackerEvents;

  constructor(page: Page) {
    this.page = page;
    this.trackerEvents = new TrackerEvents(this);
  }

  public build() {
    // Here the page events will be established.
  }

}