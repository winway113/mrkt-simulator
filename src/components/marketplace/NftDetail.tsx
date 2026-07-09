import WebApp from "@twa-dev/sdk";
import { FALLBACK_BACKDROPS } from "../../data/fallbackBackdrops";
import { useCatalogStore } from "../../store/catalogStore";
import { rarityPct, useMarketStore } from "../../store/marketStore";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { DiamondIcon } from "../layout/DiamondIcon";
import { PriceChart } from "./PriceChart";

export function NftDetail() {
  const { selectedNftId, market, selectNft, buyNft, toggleCart, cart, setShowOffer, fees } = useMarketStore();
  const backdrops = useCatalogStore((s) => s.backdrops);
  const nft = market.find((x) => x.id === selectedNftId);
  if (!nft) return null;

  const backdrop = backdrops.find((b) => b.name === nft.backdropName) ?? FALLBACK_BACKDROPS[0];
  const fee = Number((fees.gasTon + (nft.priceTon * (fees.platformPct + fees.royaltyPct)) / 100).toFixed(2));
  const history = Array.from({ length: 12 }, (_, i) =>
    Number((nft.priceTon * (0.85 + (i / 11) * 0.2 + Math.sin(i) * 0.05)).toFixed(2))
  );
  const inCart = cart.includes(nft.id);

  const handleBuy = () => {
    buyNft(nft.id);
    try {
      WebApp.HapticFeedback.notificationOccurred("success");
    } catch {
      /* */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-slide-up">
        <div className="relative h-[42vh]">
          <GiftListingVisual nft={nft} className="h-full w-full" size="detail" />
        <button
          onClick={() => selectNft(undefined)}
          className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-lg backdrop-blur"
        >
          ←
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide px-4 pb-32">
        <h1 className="mt-3 text-xl font-bold">{nft.giftName}</h1>
        <p className="text-sm text-textMuted">#{nft.serial}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Attr label="Модель" value={nft.model} color={backdrop.hex.centerColor} sub={rarityPct(nft.modelRarityPermille)} />
          <Attr label="Символ" value={nft.symbolName} color={backdrop.hex.patternColor} />
          <Attr label="Фон" value={nft.backdropName} color={backdrop.hex.edgeColor} />
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-card px-4 py-3">
          <div>
            <p className="text-xs text-textMuted">Цена</p>
            <div className="flex items-center gap-1">
              <DiamondIcon size={18} />
              <span className="text-2xl font-bold">{nft.priceTon.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-textDim">+{fee} комиссия</p>
          </div>
          <div className="flex gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card2 text-lg">♡</button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-card2 text-lg">↗</button>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={handleBuy} className="btn-yellow flex-1 py-3.5 text-base">
            Купить
          </button>
          <button onClick={() => setShowOffer(true, nft.id)} className="btn-dark flex-1 py-3.5 text-sm">
            Оффер
          </button>
        </div>

        <button
          onClick={() => toggleCart(nft.id)}
          className={`mt-2 w-full rounded-xl py-2.5 text-sm font-semibold ${inCart ? "bg-mrkt-yellow/20 text-mrkt-yellow" : "bg-card2 text-textMuted"}`}
        >
          {inCart ? "✓ В корзине" : "Добавить в корзину"}
        </button>

        <p className="mt-4 text-xs text-textMuted">
          Владелец <span className="text-textPrimary">@{nft.ownerName}</span>
        </p>

        <div className="mt-4">
          <PriceChart prices={history} />
        </div>
      </div>
    </div>
  );
}

function Attr({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-card p-3">
      <p className="text-[10px] text-textDim">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        <span className="text-sm font-medium">{value}</span>
        {sub && <span className="rounded bg-mrkt-yellow/20 px-1.5 py-0.5 text-[10px] font-bold text-mrkt-yellow">{sub}</span>}
      </div>
    </div>
  );
}
