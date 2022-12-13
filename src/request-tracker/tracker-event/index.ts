import { HTTPRequest, Page } from "puppeteer";
import { EventName } from "../../../@types/request-event-queue";
import TrackerQueue from "../tracker-queue";
import RequestEventQueue from "./event-queue";
import ControllerRequestHandler from "./request-handler";

export default class TrackerEvent {

  private controllerRequestHandler: ControllerRequestHandler;
  private eventQueue?: RequestEventQueue;

  constructor(queueInstance: TrackerQueue, eventQueueInstance?: RequestEventQueue) {
    this.controllerRequestHandler = new ControllerRequestHandler(queueInstance);
    this.eventQueue = eventQueueInstance;
  }

  private async executeAll(event: EventName, request: HTTPRequest) {
    if (!this.eventQueue) return null;
    await this.eventQueue.executeAll(event, request);
  }

  public async build(page: Page) {

    page.setDefaultNavigationTimeout(0)
    await page.setRequestInterception(true);

    page.on('request', async request => {
      this.controllerRequestHandler.onRequest(request);
      await this.executeAll('request', request);
    });

    page.on('requestfinished', async request => {
      await this.controllerRequestHandler.onRequestFinished(request);
      await this.executeAll('requestfinished', request);
    });

    page.on('requestfailed', async request => {
      this.controllerRequestHandler.onRequestFailed();
      await this.executeAll('requestfailed', request);
    });

    return this;

  }

}

/*
  reference:
    https://stackoverflow.com/questions/52969381/how-can-i-capture-all-network-requests-and-full-response-data-when-loading-a-pag
*/