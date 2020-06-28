import { config } from "https://deno.land/x/dotenv/mod.ts";
import { serializeError } from "https://deno.land/x/deno_serialize_error/mod.ts";

const PROJECT_DIR = `${Deno.env.get("HOME")}/stock-deal-finder`;
const { LIVE_API_KEY, PAPER_API_KEY, PAPER_SECRET_KEY } = config({
  safe: true,
  path: `${PROJECT_DIR}/.env`,
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
    if (lastPrice.code > 40000000) {
      throw new Error(
        `${tickerSymbol} - ERROR: lastPrice response - ${JSON.stringify(
          lastPrice
        )}`
      );
    } else {
      console.log(`${tickerSymbol}: lastPrice complete`);
    }

    const financials = await (
      await fetch(
        `https://api.polygon.io/v2/reference/financials/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
      )
    ).json();
    if (financials.status === "ERROR") {
      throw new Error(
        `${tickerSymbol} - ERROR: financials response - ${JSON.stringify(
          financials
        )}`
      );
    } else {
      console.log(`${tickerSymbol}: financials complete`);
    }

    const dividends = await (
      await fetch(
        `https://api.polygon.io/v2/reference/dividends/${tickerSymbol}?apiKey=${LIVE_API_KEY}`
      )
    ).json();
    if (dividends.status === "ERROR") {
      throw new Error(
        `${tickerSymbol} - ERROR: dividends response - ${JSON.stringify(
          dividends
        )}`
      );
    } else {
      console.log(`${tickerSymbol}: dividends complete`);
    }

    return {
      lastPrice,
      financials,
      dividends,
    };
  } catch (err) {
    console.error(
      `${tickerSymbol}: CAUGHT ERROR: ${JSON.stringify(serializeError(err))}`
    );
  }
};

export default getStockInfo;
