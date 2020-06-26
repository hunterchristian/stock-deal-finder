const stockSources = {
  lastPrice: 'https://data.alpaca.markets/v1/last/stocks/',
  lastDividend: 

async function main() {
  const res = (await fetch(url)).json();
  await Deno.stdout.write(res);
}
