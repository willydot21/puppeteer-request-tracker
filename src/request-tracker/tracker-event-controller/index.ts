import { HTTPRequest, Page } from "puppeteer";
import TrackerQueue from "../tracker-queue";
import EventHandler from "./event-handler";

export default class TrackerEventController {

  private eventHandler: EventHandler;

  constructor(queueInstance: TrackerQueue) {
    this.eventHandler = new EventHandler(queueInstance);
  }

  public async build(page: Page) {

    page.setDefaultNavigationTimeout(0)
    await page.setRequestInterception(true);

    page.on('request', request =>
      this.onRequest(request));

    page.on('requestfinished', request =>
      this.onRequestFinished(request));

    page.on('requestfailed', request =>
      this.onRequestFailed(request));

    return this;
  }

  private onRequest(request: HTTPRequest) {
    this.eventHandler.onRequest(request);
    // now here can execute other handlers...
  }

  private async onRequestFinished(request: HTTPRequest) {
    await this.eventHandler.onRequestFinished(request);
  }

  private onRequestFailed(_request: HTTPRequest) {
    this.eventHandler.onRequestFailed();
  }

}

/*
  reference:
    https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag
*/