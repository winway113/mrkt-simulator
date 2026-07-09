import { useState } from "react";
import { useMarketStore } from "../../store/marketStore";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { AppHeader } from "../layout/AppHeader";
import { CategoryTabs } from "../marketplace/CategoryTabs";
import { FilterChips } from "../marketplace/FilterChips";
import { DiamondIcon } from "../layout/DiamondIcon";

export function StorageScreen() {
  const { inventory, storageTab, setStorageTab, listNft, cancelList } = useMarketStore();
  const [listingId, setListingId] = useState<string>();
  const [price, setPrice] = useState("10");

  const onSale = inventory.filter((x) => x.marketListingId);
  const vault = inventory.filter((x) => !x.marketListingId);
  const shown = storageTab === "on_sale" ? onSale : vault;
  const editing = inventory.find((x) => x.id === listingId);

  const daysLeft = (expires?: number) => {
    if (!expires) return "";
    const d = Math.floor((expires - Date.now()) / 86_400_000);
    const h = Math.floor(((expires - Date.now()) % 86_400_000) / 3_600_000);
    return `${d}д ${h}ч`;
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <CategoryTabs />
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 opacity-50">
          <span>🔍</span>
          <span className="text-sm text-textDim">Поиск по названию NFT / номеру</span>
        </div>
      </div>
      <FilterChips />
      <div className="flex gap-4 border-b border-border px-3">
        <button onClick={() => setStorageTab("on_sale")} className={`tab-category ${storageTab === "on_sale" ? "tab-category-active" : ""}`}>
          На продаже ({onSale.length})
        </button>
        <button onClick={() => setStorageTab("vault")} className={`tab-category ${storageTab === "vault" ? "tab-category-active" : ""}`}>
          Хранилище ({vault.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hide p-3 safe-nav">
        {shown.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="text-6xl">🧸</span>
            <p className="mt-4 font-bold">Нет подарков в хранилище</p>
            <p className="mt-2 max-w-xs text-xs text-textMuted leading-relaxed">Купите подарки на маркете, чтобы начать трейдинг в симуляторе</p>
            <button className="btn-yellow mt-6 px-8 py-3 text-sm">Вперёд за подарками</button>
          </div>
        ) : (
          <div className="grid auto-rows-max grid-cols-2 gap-2">
            {shown.map((nft) => (
              <div key={nft.id} className="overflow-hidden rounded-2xl bg-card">
                <div className="relative aspect-square w-full">
                  <GiftListingVisual nft={nft} />
                  {nft.listExpiresAt && (
                    <span className="absolute left-1.5 top-1.5 z-20 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px]">
                      {daysLeft(nft.listExpiresAt)}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-bold">{nft.giftName}</p>
                  <p className="text-[10px] text-textMuted">#{nft.serial}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    <DiamondIcon size={10} />
                    <span className="text-sm font-bold">{(nft.listedPriceTon ?? nft.boughtForTon).toFixed(2)}</span>
                  </div>
                  {nft.marketListingId ? (
                    <div className="mt-2 flex gap-1">
                      <button onClick={() => cancelList(nft.id)} className="btn-yellow flex-1 py-2 text-[10px]">
                        Отменить
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-card2 text-xs">✎</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setListingId(nft.id);
                        setPrice(String((nft.boughtForTon * 1.1).toFixed(2)));
                      }}
                      className="btn-yellow mt-2 w-full py-2 text-[10px]"
                    >
                      Выставить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70" onClick={() => setListingId(undefined)}>
          <div className="w-full rounded-t-3xl bg-card p-5 pb-10" onClick={(e) => e.stopPropagation()}>
            <p className="font-bold">
              {editing.giftName} #{editing.serial}
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-2xl bg-surface px-4 py-3">
              <DiamondIcon />
              <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-transparent text-xl font-bold outline-none" />
            </div>
            <button
              className="btn-yellow mt-4 w-full py-3.5"
              onClick={() => {
                listNft(editing.id, Number(price));
                setListingId(undefined);
              }}
            >
              Выставить за {Number(price).toFixed(2)} TON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
