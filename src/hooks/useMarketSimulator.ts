import { useEffect } from "react";
import { useMarketStore } from "../store/marketStore";

export function useMarketSimulator() {
  const tickMarket = useMarketStore((s) => s.tickMarket);
  const marketReady = useMarketStore((s) => s.marketReady);

  useEffect(() => {
    if (!marketReady) return;
    const timer = window.setInterval(tickMarket, 5_000);
    return () => window.clearInterval(timer);
  }, [tickMarket, marketReady]);
}
