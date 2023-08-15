import { Page } from 'puppeteer';
import TrackerEvent from './tracker-event';
import TrackerQueue from './tracker-queue';
import { EventHandler, EventName } from '../../@types/request-event-queue';
import EventQueue from './tracker-event/event-queue';

export default class RequestTracker {

  private page: Page;
  private eventQueue = new EventQueue();
  private trackerQueue = new TrackerQueue();
  private trackerEvent = new TrackerEvent(this.trackerQueue, this.eventQueue);

  constructor(page: Page) {
    this.page = page;
  }

  static async create(page: Page) {
    const instance = new RequestTracker(page);
    await instance.trackerEvent.build(page);
    return instance
  }

  public on(event: EventName, handler: EventHandler) {
    this.eventQueue.add(event, handler);
  }

  public getStack() {
    return this.trackerQueue.getFinished();
  }

  public getPending() {
    return this.trackerQueue.getPending();
  }

}