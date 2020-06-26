import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { LIVE_API_KEY, PAPER_API_KEY, PAPER_SECRET_KEY } = config({
  safe: true,
});

const getStockInfo = async (tickerSymbol: string) => ({
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
  lastDividend: await (
    await fetch(
      `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
    )
  ).json(),
});

async function main() {
  const tickerSymbols = ['AAPL'];
  for (let tickerSymbol of tickerSymbols) {
    const res = await getStockInfo(tickerSymbol);
    console.log(res);
  }
}

main();
