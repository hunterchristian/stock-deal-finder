import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { API_KEY } = config({ safe: true });

const getStockInfo = async (tickerSymbol: string) => ({
  lastPrice: (
    await fetch(`https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`)
  ).json(),
  lastDividend: (
    await fetch(
      `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${API_KEY}`
    )
  ).json(),
});

async function main() {
  const tickerSymbols = ['AAPL'];
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}
