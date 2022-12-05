import puppeteer from "puppeteer";
import RequestTracker from "../main";

async function test() {

  const url = 'https://tioanime.com/';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const tracker = new RequestTracker(page);
  await tracker.build();

  await page.goto(url, {
    waitUntil: 'networkidle0'
  }).catch(error => console.log(error));

  console.log(tracker.getStack().length);

}

test();