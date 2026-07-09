import { useMarketStore } from "../../store/marketStore";
import { AppHeader } from "../layout/AppHeader";
import { CategoryTabs } from "./CategoryTabs";
import { FilterChips } from "./FilterChips";
import { NftCard } from "./NftCard";

export function MarketScreen() {
  const { query, setQuery, setShowFeed, setShowCart, cart, getFilteredMarket, selectNft } = useMarketStore();
  const items = getFilteredMarket();

  return (
    <div className="flex h-full flex-col">
      <AppHeader />
      <CategoryTabs />
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-card px-3 py-2">
          <span className="text-textDim">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию NFT / номеру"
            className="w-full bg-transparent text-sm outline-none placeholder:text-textDim"
          />
        </div>
        <button onClick={() => setShowCart(true)} className="relative shrink-0 text-xl opacity-90">
          🛒
          {cart.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
              {cart.length}
            </span>
          )}
        </button>
        <button onClick={() => setShowFeed(true)} className="btn-yellow-sm shrink-0 px-3">
          Feed
        </button>
      </div>
      <FilterChips />
      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-textMuted">Ничего не найдено</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto scroll-hide safe-nav">
          <div className="grid auto-rows-max grid-cols-3 gap-2 px-2 pb-4">
            {items.map((nft) => (
              <NftCard key={nft.id} nft={nft} onOpen={() => selectNft(nft.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
