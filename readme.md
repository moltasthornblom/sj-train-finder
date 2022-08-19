# SJ TRAIN FINDER

This is a nodejs program created for the sole purpose of finding SJ departures that are sold out

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SMTP_USER`
`SMTP_PASS`
`SMTP_HOST`
`SMTP_PORT`
`TARGET_MAIL`

## Installation

**MAKE SURE TO ADD ENVIRONMENT VARIABLES FIRST**

```bash
  npm i
```

## Usage/Examples

Change constants to your liking

Example: \
Change _SEARCH_URL_ to the url of your train search \
Change _TIME_TOP_ and _TIME_BOT_ to match your needs: hh:mm\
Change _ATTRIBUTE_FILTER_ to "1 klass," or "2 klass,"

```javascript
const SEARCH_URL = "insert_search_url_here";
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
```

## Run

To start the script run

```bash
  node app.js
```
