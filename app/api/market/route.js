import { NextResponse } from "next/server";

const BROKER_CONFIG = {
  forex: {
    spreadPips: {
      EURUSD: 1.2,
      GBPUSD: 1.5,
      USDJPY: 1.3,
      AUDUSD: 1.4,
      USDCAD: 1.6,
      USDCHF: 1.4,
      NZDUSD: 1.5,
      EURGBP: 1.2,
      EURJPY: 1.6,
      GBPJPY: 2.0,
    },
    pipSize: {
      EURUSD: 0.0001,
      GBPUSD: 0.0001,
      AUDUSD: 0.0001,
      NZDUSD: 0.0001,
      EURGBP: 0.0001,
      USDJPY: 0.01,
      EURJPY: 0.01,
      GBPJPY: 0.01,
      USDCAD: 0.0001,
      USDCHF: 0.0001,
    },
  },
};

function randomPrice(mid) {
  return mid * (1 + (Math.random() - 0.5) / 120);
}

function buildForexPrice(symbol, midPrice) {
  const pip = BROKER_CONFIG.forex.pipSize[symbol];
  const spread = BROKER_CONFIG.forex.spreadPips[symbol] * pip;
  const bid = midPrice - spread / 2;
  return {
    symbol,
    price: Number(bid.toFixed(5)),
    up: Math.random() > 0.5,
  };
}

export async function GET() {
  try {
    // Forex base mid prices
    const forexMid = {
      EURUSD: 1.1023,
      GBPUSD: 1.2589,
      USDJPY: 144.21,
      AUDUSD: 0.6854,
      USDCAD: 1.3724,
      USDCHF: 0.8742,
      NZDUSD: 0.6123,
      EURGBP: 0.8581,
      EURJPY: 159.42,
      GBPJPY: 183.76,
    };

    // Crypto
    const crypto = [
      { symbol: "BTCUSD", price: 43210 },
      { symbol: "ETHUSD", price: 2280 },
      { symbol: "BNBUSD", price: 312 },
      { symbol: "SOLUSD", price: 98.4 },
      { symbol: "XRPUSD", price: 0.61 },
    ];

    // Stocks
    const stocks = [
      { symbol: "AAPL", price: 195.3 },
      { symbol: "TSLA", price: 248.12 },
      { symbol: "MSFT", price: 412.8 },
      { symbol: "AMZN", price: 173.2 },
      { symbol: "NVDA", price: 504.6 },
    ];

    // Build response
    const forexPrices = Object.entries(forexMid).map(([symbol, mid]) =>
      buildForexPrice(symbol, randomPrice(mid))
    );

    const cryptoPrices = crypto.map((c) => ({
      symbol: c.symbol,
      price: Number((c.price * (1 + (Math.random() - 0.5) / 80)).toFixed(2)),
      up: Math.random() > 0.5,
    }));

    const stockPrices = stocks.map((s) => ({
      symbol: s.symbol,
      price: Number((s.price * (1 + (Math.random() - 0.5) / 100)).toFixed(2)),
      up: Math.random() > 0.5,
    }));

    return NextResponse.json([...forexPrices, ...cryptoPrices, ...stockPrices], { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
