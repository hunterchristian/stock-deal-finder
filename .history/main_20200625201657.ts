import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { API_KEY } = config({ safe: true });

const getStockInfo = (tickerSymbol: string) => ({
  lastPrice: `https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`,
  lastDividend: `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${API_KEY}`,
});

async function main() {
  const tickerSymbols = ['AAPL'];
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}
