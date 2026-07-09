import { fragmentGiftPreviewUrl } from "../../services/giftAssets";
import { useMarketStore } from "../../store/marketStore";
import { AppHeader } from "../layout/AppHeader";
import { DiamondIcon } from "../layout/DiamondIcon";

export function OrdersScreen() {
  const { buyOrders, sellToOrder } = useMarketStore();

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <div className="flex border-b border-border px-3">
        <button className="tab-category tab-category-active mr-4">Ордеры</button>
        <button className="tab-category">Мои ордеры</button>
      </div>
      <div className="flex-1 overflow-y-auto scroll-hide px-3 py-2 safe-nav">
        {buyOrders.map((o) => (
          <div key={o.id} className="mb-2 flex items-center gap-3 rounded-xl bg-card p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-card2">
              <img src={fragmentGiftPreviewUrl(o.giftName)} alt={o.giftName} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{o.giftName}</p>
              <p className="text-xs text-textMuted">Количество: {o.quantity}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <DiamondIcon size={12} />
                <span className="font-bold">{o.priceTon.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <button className="rounded-lg bg-card2 px-3 py-1.5 text-xs font-semibold">Детали</button>
              <button onClick={() => sellToOrder(o.id)} className="btn-yellow-sm px-3 py-1.5 text-xs">
                Продать
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] left-0 right-0 mx-auto max-w-[430px] px-4">
        <button className="btn-yellow w-full py-3.5 text-sm shadow-lg">Создать ордер</button>
      </div>
    </div>
  );
}
