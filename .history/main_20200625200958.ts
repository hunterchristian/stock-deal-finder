const stockSources = {
  lastPrice: 'https://data.alpaca.markets/v1/last/stocks/<ticker_symbol>',
  lastDividend:
    'https://api.polygon.io/v2/reference/dividends/AAPL?apiKey=<api_key>',
};

async function main() {
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}
