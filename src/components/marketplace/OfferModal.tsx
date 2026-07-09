import { estimateFloor } from "../../data/giftNames";
import { useMarketStore } from "../../store/marketStore";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { DiamondIcon } from "../layout/DiamondIcon";

export function OfferModal() {
  const { showOffer, offerTargetId, market, player, setShowOffer, makeOffer } = useMarketStore();
  if (!showOffer || !offerTargetId) return null;

  const nft = market.find((x) => x.id === offerTargetId);
  if (!nft) return null;

  const floor = estimateFloor(nft.giftName);

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/70 animate-fade-in" onClick={() => setShowOffer(false)}>
      <div className="w-full animate-slide-up rounded-t-3xl bg-card p-5 pb-10" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl">
          <GiftListingVisual nft={nft} className="h-full w-full" />
        </div>
        <p className="mt-3 text-center font-bold">{nft.giftName}</p>
        <p className="text-center text-sm text-textMuted">#{nft.serial}</p>
        <h2 className="mt-4 text-center text-lg font-bold">Сделать оффер</h2>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3">
          <input
            type="number"
            placeholder="Введите цену"
            id="offer-price"
            className="w-full bg-transparent text-base outline-none"
            defaultValue={String((nft.priceTon * 0.95).toFixed(2))}
          />
          <DiamondIcon />
        </div>
        <p className="mt-2 text-center text-[10px] text-textDim leading-relaxed">
          Средства будут заблокированы и вернутся, если оффер отклонят / отменят / он истечёт
        </p>
        <p className="mt-3 text-center text-xs text-textMuted">
          {nft.giftName} Флор: <DiamondIcon size={10} /> {floor.toFixed(2)}
        </p>
        <p className="mt-1 text-center text-sm">
          Баланс: <DiamondIcon size={12} /> {player.ton.toFixed(4)}
        </p>
        <button
          className="btn-yellow mt-4 w-full py-3.5"
          onClick={() => {
            const el = document.getElementById("offer-price") as HTMLInputElement;
            makeOffer(offerTargetId, Number(el.value));
          }}
        >
          Сделать оффер
        </button>
      </div>
    </div>
  );
}
