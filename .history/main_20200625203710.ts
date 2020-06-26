import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { API_KEY } = config({ safe: true });

const getStockInfo = async (tickerSymbol: string) => ({
  lastPrice: (
    await fetch(`https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`)
  ).json(),
  lastDividend: (
    await fetch({
      url: `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${API_KEY}`,
      cache: 'no-cache',
      credentials: 'omit',
      destination: 'object',
    })
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
