//IMPORTS
const puppeteer = require("puppeteer");
const { sendMail } = require("./mailer");
const moment = require("moment");

//CONSTANTS
const SEARCH_URL =
  "https://www.sj.se/kop-resa/valj-resa/G%C3%B6teborg%20C/Enk%C3%B6ping/2022-08-21";
const BROWSER_DIMENSIONS = { width: 1920, height: 5080 };
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64)" +
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
const VERBOSE = false;
const TIME_FORMAT = "hh:mm";
const TIME_TOP = moment("08:00", TIME_FORMAT);
const TIME_BOT = moment("23:59", TIME_FORMAT);
const INTERVAL = 60; // Run interval in seconds
const ATTRIBUTE_FILTER = "2 klass,";
//FUNCTIONS
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
function prettyPrint(trainData) {
  /*
  Parses the train data and if verbose is true it also prints the data with color formatting 
  depending on some criteria is met etc: 
  [red: not available, yellow: available but time not met, green: available]
  */
  let unavailableTrains = [];
  let availableTrains = [];
  trainData.forEach((element) => {
    tags = element.split(",");
    let train = {
      departs: tags[0].split("Avgångstid ")[1].split(" - ")[0],
      arrives: tags[0].split("Ankomsttid ")[1],
      status: tags[1].replace(/\s/g, ""),
      travel_time: tags[2].split("Restid ")[1],
      train_changes: tags[3].split(" byten")[0],
    };
    let attributeMet = false;
    element.split("\n").forEach((element) => {
      if (element.includes(ATTRIBUTE_FILTER)) {
        attributeMet = true;
      }
    });

    if (tags[1].includes("Slutsåld") || !attributeMet) {
      unavailableTrains.push(train);
      if (VERBOSE) console.log("\x1b[31m" + JSON.stringify(train));
    } else if (
      !moment(train.arrives, TIME_FORMAT).isBetween(TIME_TOP, TIME_BOT)
    ) {
      unavailableTrains.push(train);
      if (VERBOSE) console.log("\x1b[33m" + JSON.stringify(train));
    } else {
      availableTrains.push(train);
      if (VERBOSE) console.log("\x1b[32m" + JSON.stringify(train));
    }
  });
  console.log(
    "\x1b[0m" + "Available Trains:",
    availableTrains.length,
    "Unavailable Trains:",
    unavailableTrains.length
  );
  return { availableTrains, unavailableTrains };
}
function evaluateTraindata(availableTrains, unavailableTrains) {
  /*
  Checks if there is any available trains that meet ALL critera and 
  proceeds to send email
   */
  let trainslist = [];
  availableTrains.forEach((train) => {
    trainslist.push(JSON.stringify(availableTrains));
  });
  if (trainslist.length > 0) sendMail(trainslist.join(" "));
}

async function trainSearch() {
  /*
  Scrapes data and proceeds to parsing
   */
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setViewport(BROWSER_DIMENSIONS);
    await page.goto(SEARCH_URL, { waitUntil: "networkidle0" });
    require("log-timestamp");
    console.log("Searching for departures...");
    await delay(4000);

    const trainData = await page.evaluate(() => {
      const elements = document.getElementsByClassName(
        "booking-MuiButtonBase-root booking-MuiCardActionArea-root"
      );

      return Array.from(elements).map((element) => element.innerText);
    });

    let { availableTrains, unavailableTrains } = prettyPrint(trainData);
    evaluateTraindata(availableTrains, unavailableTrains);
    await browser.close();
  } catch (error) {
    console.error(error);
  }
}

const run = async () => {
  while (true) {
    await trainSearch();
    console.log("Delay -", INTERVAL, "seconds");
    await delay(INTERVAL * 1000);
  }
};

run();
