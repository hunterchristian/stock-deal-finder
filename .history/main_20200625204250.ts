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
      headers: {
        ['APCA-API-KEY-ID']: 'PKTE1YC0VIEDKNB1Z41N',
        ['APCA-API-SECRET-KEY']: 'VPnCmoBmAmLWaumkT0cXcjTHfg5RZLpeqUN1JTVg',
      },
      integrity: '',
      isHistoryNavigation: false,
      isReloadNavigation: false,
      keepalive: false,
      method: 'GET',
      mode: 'no-cors',
      redirect: 'follow',
      referrer: '',
      referrerPolicy: 'no-referrer',
      signal: {
        aborted: false,
        onabort: null,
      },
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
