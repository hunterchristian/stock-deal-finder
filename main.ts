import { config } from 'https://deno.land/x/dotenv/mod.ts';

const MAXIMUM_REQUESTS_PER_MINUTE = 200;

const { LIVE_API_KEY, PAPER_API_KEY, PAPER_SECRET_KEY } = config({
  safe: true,
});

// https://alpaca.markets/docs/api-documentation/api-v2/market-data/last-trade/
// https://polygon.io/docs/#get_v2_reference_dividends__symbol__anchor
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

const getSumDividends = (dividends: any[]) =>
  dividends.reduce((a, v) => a + v.amount, 0);

async function main() {
  const tickerSymbols = ['AAPL'];
  for (let tickerSymbol of tickerSymbols) {
    const res = await getStockInfo(tickerSymbol);

    const lastPrice = res.lastPrice.last.price;
    const latestDividends = res.lastDividend.results.slice(0, 4);
    const avgLatestDividend = getSumDividends(latestDividends) / 4;
    const peRatio = lastPrice / avgLatestDividend;
    const stockData = {
      name: res.lastPrice.symbol,
      lastPrice,
      peRatio,
      avgLatestDividend,
      latestDividends,
    };
    await Deno.writeTextFileSync(
      './stock-data.json',
      JSON.stringify(stockData, null, 2)
    );
  }
}

main();
