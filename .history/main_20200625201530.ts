import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { API_KEY } = config({ safe: true });

const stockSources = {
  lastPrice: 'https://data.alpaca.markets/v1/last/stocks/<ticker_symbol>',
  lastDividend: `https://api.polygon.io/v2/reference/dividends/<ticker_symbol>?apiKey=${API_KEY}`,
};

async function main() {
  const tickerSymbols;
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}