import { config } from "https://deno.land/x/dotenv/mod.ts";

const { LIVE_API_KEY, PAPER_API_KEY, PAPER_SECRET_KEY } = config({
  safe: true,
});

// https://alpaca.markets/docs/api-documentation/api-v2/market-data/last-trade/
// https://polygon.io/docs/#get_v2_reference_dividends__symbol__anchor
const getStockInfo = async (tickerSymbol: string) => {
  console.log(`${tickerSymbol}: in getStockInfo`);
  try {
    const lastPrice = await (
      await fetch(
        new Request(
          `https://data.alpaca.markets/v1/last/stocks/${tickerSymbol}`,
          {
            headers: {
              "APCA-API-KEY-ID": PAPER_API_KEY,
              "APCA-API-SECRET-KEY": PAPER_SECRET_KEY,
            },
          }
        )
      )
    ).json();
    console.log(`${tickerSymbol}: lastPrice complete`);

    const financials = await (
      await fetch(
        `https://api.polygon.io/v2/reference/financials/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
      )
    ).json();
    console.log(`${tickerSymbol}: financials complete`);

    const dividends = await (
      await fetch(
        `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
      )
    ).json();
    console.log(`${tickerSymbol}: dividends complete`);

    return {
      lastPrice,
      financials,
      dividends,
    };
  } catch (err) {
    console.error(`${tickerSymbol}: CAUGHT ERROR: ${err.message}`);
  }
};

export default getStockInfo;
