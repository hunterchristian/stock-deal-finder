import { writeCSV } from "https://deno.land/x/csv/mod.ts";
import T from "./scripts/tickersymbols/tickersymbols.ts";
import getStockInfoForSlice from "./getStockInfoForSlice.ts";
import { serializeError } from "https://deno.land/x/deno_serialize_error/mod.ts";

const TICKER_SYMBOLS = T.slice(0, 10);

const PROJECT_DIR = `${Deno.env.get("HOME")}/stock-deal-finder`;
const MAXIMUM_REQUESTS_PER_MINUTE = 180;
const csvHeaderRow = [
  "Ticker symbol",
  "Last price",
  "Price-to-earnings ratio",
  "Earnings per basic share USD",
  "Avg of last 4 dividend payouts",
];

async function main() {
  try {
    let rows = [[new Date().toDateString(), "", "", "", ""], csvHeaderRow];
    let index = 0;
    console.log(`main.ts: Job run timestamp - ${new Date()}`);
    console.log(`main.ts: fetching data for ${TICKER_SYMBOLS.length} stocks`);
    while (index < TICKER_SYMBOLS.length) {
      const stockDataSlice = await getStockInfoForSlice(
        TICKER_SYMBOLS,
        index,
        Math.min(TICKER_SYMBOLS.length, index + MAXIMUM_REQUESTS_PER_MINUTE)
      );
      rows = rows.concat(stockDataSlice);
      index = Math.min(
        TICKER_SYMBOLS.length,
        index + MAXIMUM_REQUESTS_PER_MINUTE
      );
    }

    try {
      await Deno.remove(`${PROJECT_DIR}/stockdata.csv`);
    } catch (err) {
      console.error(
        `main.ts: CAUGHT ERROR: ${JSON.stringify(serializeError(err))}`
      );
    }

    const f = await Deno.open(`${PROJECT_DIR}/stockdata.csv`, {
      write: true,
      create: true,
      truncate: true,
    });
    await writeCSV(f, rows);
    f.close();
    console.log(
      `main.ts: wrote ${rows.length} rows to ${PROJECT_DIR}/stockdata.csv`
    );
  } catch (err) {
    console.error(
      `main.ts: CAUGHT ERROR: ${JSON.stringify(serializeError(err))}`
    );
  }
}

main();
