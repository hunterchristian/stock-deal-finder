import getSingleStockInfo from "./getSingleStockInfo.ts";
import { serializeError } from "https://deno.land/x/deno_serialize_error/mod.ts";

const ONE_MINUTE_MILLIS = 60000;
const MAX_PRICE_TO_EARNINGS_RATIO = 50;
const MIN_PRICE_TO_EARNINGS_RATIO = 0;

const getSumDividends = (dividends: any[]) =>
  dividends.reduce((a, v) => a + v.amount, 0);

const getStockInfoForSlice = async (
  stocks: any,
  startIndex: number,
  endIndex: number
): Promise<string[][]> =>
  new Promise(async (resolve) => {
    console.log(
      `getStockInfoForSlice.ts: starting index: ${startIndex}, endIndex: ${endIndex}`
    );
    setTimeout(async () => {
      const rows = [];
      for (let stock of stocks.slice(startIndex, endIndex)) {
        console.log("===============================");
        const res = await getSingleStockInfo(stock);

        try {
          if (!res) {
            throw new Error(`${stock}: no response for stock info, skipping.`);
          }

          const lastPrice = res.lastPrice.last
            ? res.lastPrice?.last?.price?.toFixed(2)
            : "No price available";
          const latestDividends = res.dividends?.results?.slice(0, 4);
          const avgLatestDividend = (
            getSumDividends(latestDividends) / 4
          ).toFixed(2);
          const priceToEarningsRatio = res.financials?.results[0]
            ? res.financials.results[0]?.priceToEarningsRatio?.toFixed(2)
            : "None";
          const earningsPerBasicShareUSD = res.financials?.results[0]
            ? res.financials.results[0]?.earningsPerBasicShareUSD?.toFixed(2)
            : "None";

          const row = [
            stock,
            lastPrice,
            priceToEarningsRatio,
            earningsPerBasicShareUSD,
            avgLatestDividend,
          ];
          console.log(`${stock}: row - ${JSON.stringify(row)}`);

          if (
            priceToEarningsRatio > MIN_PRICE_TO_EARNINGS_RATIO &&
            priceToEarningsRatio < MAX_PRICE_TO_EARNINGS_RATIO
          ) {
            console.log(`${stock}: stock matches criteria, adding row`);
            rows.push(row);
          } else {
            console.log(`${stock}: stock does not meet criteria, skipping`);
          }
        } catch (err) {
          console.error(
            `${stock}: CAUGHT ERROR: ${JSON.stringify(serializeError(err))}`
          );
        }
      }

      resolve(rows);
    }, ONE_MINUTE_MILLIS);
  });

export default getStockInfoForSlice;
