import { GIFT_NAMES, estimateFloor } from "../../data/giftNames";
import { feedColor, feedLabel, useMarketStore } from "../../store/marketStore";
import { FeedEvent, FeedEventType } from "../../types/market";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { DiamondIcon } from "../layout/DiamondIcon";

function fmtTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function FeedScreen() {
  const { feed, showFeed, setShowFeed } = useMarketStore();
  if (!showFeed) return null;

  const types: FeedEventType[] = ["SALE", "LISTING", "PRICE_CHANGE", "DELIST", "OFFER_SALE"];
  const items: FeedEvent[] = feed.length
    ? feed
    : GIFT_NAMES.slice(0, 5).map((giftName, i) => ({
        id: `mock-${i}`,
        type: types[i % types.length],
        giftName,
        serial: 20000 + i * 111,
        priceTon: estimateFloor(giftName),
        model: "Original",
        backdropName: "Aquamarine",
        symbolName: "",
        at: Date.now() - i * 60_000
      }));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-slide-up">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button onClick={() => setShowFeed(false)} className="text-sm text-mrkt-yellow">
          ← Назад
        </button>
        <h1 className="text-lg font-bold">Feed</h1>
      </div>
      <div className="flex-1 overflow-y-auto scroll-hide safe-nav">
        {items.map((e) => (
          <div key={e.id} className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
              <GiftListingVisual
                nft={{
                  giftName: e.giftName,
                  serial: e.serial,
                  model: e.model ?? "Original",
                  backdropName: e.backdropName ?? "Aquamarine",
                  symbolName: e.symbolName ?? ""
                }}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {e.giftName} #{e.serial}
              </p>
              <p className={`text-[10px] font-bold uppercase ${feedColor(e.type)}`}>{feedLabel(e.type)}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-0.5">
                <DiamondIcon size={11} />
                <span className="text-sm font-bold">{e.priceTon.toFixed(2)}</span>
              </div>
              <p className="text-[9px] text-textDim">{fmtTime(e.at)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <button onClick={() => setShowFeed(false)} className="btn-yellow w-full py-3.5 text-sm">
          🔄 Обновить
        </button>
      </div>
    </div>
  );
}
