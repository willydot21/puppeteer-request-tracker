import RequestTracker from "./main";


export default class TrackerEvents {

  private tracker: RequestTracker;

  constructor(trackerInstance: RequestTracker) {
    this.tracker = trackerInstance;
  }

}