import { useMarketStore } from "../../store/marketStore";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { DiamondIcon } from "../layout/DiamondIcon";

export function CartScreen() {
  const { cart, market, showCart, setShowCart, toggleCart, buyCart } = useMarketStore();
  if (!showCart) return null;

  const items = cart.map((id) => market.find((x) => x.id === id)).filter(Boolean);
  const total = items.reduce((s, x) => s + (x?.priceTon ?? 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold">Корзина 🔥</h1>
        <button onClick={() => setShowCart(false)} className="text-textMuted">
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scroll-hide px-4 safe-nav">
        {items.length === 0 ? (
          <p className="py-12 text-center text-textMuted">Корзина пуста</p>
        ) : (
          <>
            <p className="mb-2 text-sm text-textMuted">Подарки</p>
            {items.map((nft) => (
              <div key={nft!.id} className="mb-2 flex items-center gap-3 rounded-xl bg-card p-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <GiftListingVisual nft={nft!} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{nft!.giftName}</p>
                  <p className="text-xs text-textMuted">#{nft!.serial}</p>
                </div>
                <div className="flex items-center gap-1">
                  <DiamondIcon size={12} />
                  <span className="font-bold">{nft!.priceTon.toFixed(2)}</span>
                </div>
                <button onClick={() => toggleCart(nft!.id)} className="text-textDim">
                  🗑
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      {items.length > 0 && (
        <div className="border-t border-border p-4 pb-8">
          <button onClick={buyCart} className="btn-yellow flex w-full items-center justify-center gap-2 py-4 text-base">
            <DiamondIcon size={16} />
            {total.toFixed(2)}
          </button>
          <p className="mt-2 text-center text-[10px] text-textDim">Комиссия Маркета включена</p>
        </div>
      )}
    </div>
  );
}
