import { HTTPRequest } from "puppeteer";
import { EventHandler, EventName, IRequestEvent } from "../../../@types/request-event-queue";

export default class EventQueue {

  private handlers: IRequestEvent = {
    request: [],
    requestfinished: [],
    requestfailed: []
  }

  public add(event: EventName, handler: EventHandler) {
    this.handlers[event].push(handler);
  }

  public next(event: EventName) {
    return this.handlers[event].shift();
  }

  public async executeAll(event: EventName, request: HTTPRequest) {

    const handlers = this.handlers[event];

    for (let index = 0; index < handlers.length; index++) {
      const next = handlers[index];
      await next(request);
    }

  }

}
