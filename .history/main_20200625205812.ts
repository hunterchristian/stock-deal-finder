import { config } from 'https://deno.land/x/dotenv/mod.ts';

const { API_KEY } = config({ safe: true });

const getStockInfo = async (
  tickerSymbol: string
): Promise<{ lastPrice: any; lastDividend: any }> => {
  const lastPrice = await fetch(
    new Request(`https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`, {
      headers: {
        'APCA-API-KEY-ID': 'PKTE1YC0VIEDKNB1Z41N',
        'APCA-API-SECRET-KEY': 'VPnCmoBmAmLWaumkT0cXcjTHfg5RZLpeqUN1JTVg',
      },
    })
  );
  const lastDividend = await fetch(
    `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${API_KEY}`
  );

  return {
    lastPrice,
    lastDividend,
  };
};

async function main() {
  const tickerSymbols = ['AAPL'];
  for (let tickerSymbol of tickerSymbols) {
    const res = await getStockInfo(tickerSymbol);
    console.log(res);
  }
}

main();
