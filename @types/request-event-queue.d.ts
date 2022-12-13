import EventQueue from "../src/request-tracker/tracker-event/event-queue";

export interface IRequestEvent {
  'request': EventHandler[];
  'requestfinished': EventHandler[];
  'requestfailed': EventHandler[];
}

export type EventHandler = (request: HTTPRequest) => Promise<void> | void;
export type EventName = 'request' | 'requestfinished' | 'requestfailed';