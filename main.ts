import { writeCSV } from 'https://deno.land/x/csv/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import TICKER_SYMBOLS from './scripts/tickersymbols/tickersymbols.ts';

const MAXIMUM_REQUESTS_PER_MINUTE = 180;
const ONE_MINUTE_MILLIS = 60000;

const { LIVE_API_KEY, PAPER_API_KEY, PAPER_SECRET_KEY } = config({
  safe: true,
});

// https://alpaca.markets/docs/api-documentation/api-v2/market-data/last-trade/
// https://polygon.io/docs/#get_v2_reference_dividends__symbol__anchor
const getStockInfo = async (tickerSymbol: string) => {
  try {
    return {
      lastPrice: await (
        await fetch(
          new Request(
            `https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`,
            {
              headers: {
                'APCA-API-KEY-ID': PAPER_API_KEY,
                'APCA-API-SECRET-KEY': PAPER_SECRET_KEY,
              },
            }
          )
        )
      ).json(),
      financials: await (
        await fetch(
          `https://api.polygon.io/v2/reference/financials/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
        )
      ).json(),
      dividends: await (
        await fetch(
          `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
        )
      ).json(),
    };
  } catch (err) {
    console.error(`CAUGHT ERROR: ${err.message}`);
  }
};

const getSumDividends = (dividends: any[]) =>
  dividends.reduce((a, v) => a + v.amount, 0);

const getStockDataSlice = async (
  stocks: any,
  startIndex: number,
  endIndex: number
): Promise<string[][]> =>
  new Promise(async (resolve, reject) => {
    console.log(`starting index: ${startIndex}, endIndex: ${endIndex}`);
    setTimeout(async () => {
      const rows = [];
      for (let stock of stocks.slice(startIndex, endIndex)) {
        console.log(`tickersymbol: ${stock.ticker}, name: ${stock.name}`);
        const res = await getStockInfo(stock.ticker);
        if (!res) {
          throw new Error(
            `No response for stock info: ${stock.ticker} - ${stock.name}, skipping.`
          );
        }

        try {
          const lastPrice = res.lastPrice.last.price.toFixed(2);
          const latestDividends = res.dividends.results.slice(0, 4);
          const avgLatestDividend = getSumDividends(latestDividends) / 4;
          const priceToEarningsRatio =
            res.financials.results[0].priceToEarningsRatio;
          const earningsPerBasicShareUSD =
            res.financials.results[0].earningsPerBasicShareUSD;

          const row = [
            stock.ticker,
            stock.name,
            lastPrice,
            priceToEarningsRatio.toFixed(2),
            earningsPerBasicShareUSD.toFixed(2),
            avgLatestDividend.toFixed(2),
          ];
          console.log(`row: ${JSON.stringify(row)}`);
          rows.push(row);
        } catch (err) {
          console.error(`CAUGHT ERROR: ${err.message}`);
        }
      }

      resolve(rows);
    }, ONE_MINUTE_MILLIS);
  });

async function main() {
  try {
    const res = await (
      await fetch(
        `https://api.polygon.io/v2/reference/tickers?type=cs&apiKey=${LIVE_API_KEY}`
      )
    ).json();
    if (!res) {
      throw new Error('No response for stock tickers, exiting.');
    }

    const stocks = res.tickers.map(({ ticker, name }: any) => ({
      ticker,
      name,
    }));

    let rows = [
      [
        'Ticker symbol',
        'Name',
        'Last price',
        'Price-to-earnings ratio',
        'Earnings per basic share USD',
        'Avg of last 4 dividend payouts',
      ],
    ];
    let index = 0;
    console.log(`fetching data for ${stocks.length} stocks`);
    while (index < TICKER_SYMBOLS.length) {
      const stockDataSlice = await getStockDataSlice(
        stocks,
        index,
        Math.min(stocks.length, index + MAXIMUM_REQUESTS_PER_MINUTE)
      );
      rows = rows.concat(stockDataSlice);
      index = Math.min(stocks.length, index + MAXIMUM_REQUESTS_PER_MINUTE);
    }

    const f = await Deno.open('./stockdata.csv', {
      write: true,
      create: true,
      truncate: true,
    });
    rows.push();
    await writeCSV(f, rows);
    f.close();
  } catch (err) {
    console.error(`CAUGHT ERROR: ${err.message}`);
  }
}

main();
