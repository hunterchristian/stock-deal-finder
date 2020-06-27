import { writeCSV } from "https://deno.land/x/csv/mod.ts";
import TICKER_SYMBOLS from "./scripts/tickersymbols/tickersymbols.ts";
import getStockInfoForSlice from "./getStockInfoForSlice.ts";

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
    let rows = [csvHeaderRow];
    let index = 0;
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

    const f = await Deno.open("./stockdata.csv", {
      write: true,
      create: true,
      truncate: true,
    });
    await writeCSV(f, rows);
    f.close();
    console.log(`main.ts: wrote ${rows.length} rows to ./stockdata.csv`);
  } catch (err) {
    console.error(`main.ts: CAUGHT ERROR: ${err.message}`);
  }
}

main();
