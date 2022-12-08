import puppeteer from "puppeteer";
import RequestTracker from "../main";

async function test() {

  const url = 'https://tioanime.com/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const tracker = new RequestTracker(page);
  await tracker.build();

}

test();