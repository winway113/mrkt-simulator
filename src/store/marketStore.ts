import { create } from "zustand";
import { BOT_NAMES } from "../data/botNames";
import { GIFT_NAMES, estimateFloor } from "../data/giftNames";
import { FALLBACK_BACKDROPS } from "../data/fallbackBackdrops";
import { useCatalogStore } from "./catalogStore";
import {
  Analytics,
  BuyOrder,
  CategoryTab,
  FeeConfig,
  FeedEvent,
  FeedEventType,
  FilterSheet,
  FilterState,
  NftListing,
  OwnedNft,
  PlayerState,
  StorageTab,
  TabId,
  ToastEvent,
  Transaction
} from "../types/market";

const fees: FeeConfig = { gasTon: 0.05, royaltyPct: 2.5, platformPct: 5 };
const uid = () => Math.random().toString(36).slice(2, 10);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const calcFee = (p: number) => Number((fees.gasTon + (p * (fees.platformPct + fees.royaltyPct)) / 100).toFixed(2));

const feedMeta = (listing: Pick<NftListing, "giftName" | "serial" | "priceTon" | "model" | "backdropName" | "symbolName">) => ({
  giftName: listing.giftName,
  serial: listing.serial,
  priceTon: listing.priceTon,
  model: listing.model,
  backdropName: listing.backdropName,
  symbolName: listing.symbolName
});

const makeListing = (giftName: string, serial: number): NftListing => {
  const catalog = useCatalogStore.getState();
  const backdrops = catalog.getBackdrops().length ? catalog.getBackdrops() : FALLBACK_BACKDROPS;
  const models = catalog.getModels(giftName);
  const symbols = catalog.getSymbols(giftName);
  const model = models.length ? pick(models) : { name: "Original", rarityPermille: 100 };
  const backdrop = pick(backdrops);
  const symbol = symbols.length ? pick(symbols) : { name: "", rarityPermille: 5 };
  const floor = estimateFloor(giftName);
  const price = Number((floor + Math.random() * 2.5).toFixed(2));

  return {
    id: uid(),
    giftName,
    serial,
    model: model.name,
    modelRarityPermille: model.rarityPermille,
    backdropName: backdrop.name,
    symbolName: symbol.name,
    priceTon: price,
    sellerName: pick(BOT_NAMES),
    ownerName: pick(BOT_NAMES),
    instantDelivery: Math.random() > 0.6,
    listedAt: Date.now() - Math.random() * 3_600_000
  };
};

const buildMarket = (): NftListing[] => {
  const names = useCatalogStore.getState().giftNames.length ? useCatalogStore.getState().giftNames : [...GIFT_NAMES];
  return Array.from({ length: 72 }, (_, i) =>
    makeListing(names[i % names.length], 10000 + i * 137 + (i % 7) * 11)
  );
};

const buildOrders = (): BuyOrder[] =>
  GIFT_NAMES.slice(0, 6).map((giftName) => ({
    id: uid(),
    giftName,
    quantity: 1,
    priceTon: Number((estimateFloor(giftName) * 1.15).toFixed(2))
  }));

const listingToOwned = (l: NftListing, opts?: { boughtForTon?: number; acquiredAt?: number }): OwnedNft => ({
  id: uid(),
  giftName: l.giftName,
  serial: l.serial,
  model: l.model,
  modelRarityPermille: l.modelRarityPermille,
  backdropName: l.backdropName,
  symbolName: l.symbolName,
  boughtForTon: opts?.boughtForTon ?? l.priceTon,
  acquiredAt: opts?.acquiredAt ?? Date.now()
});

type State = {
  activeTab: TabId;
  categoryTab: CategoryTab;
  storageTab: StorageTab;
  query: string;
  player: PlayerState;
  market: NftListing[];
  marketReady: boolean;
  inventory: OwnedNft[];
  cart: string[];
  buyOrders: BuyOrder[];
  feed: FeedEvent[];
  transactions: Transaction[];
  toasts: ToastEvent[];
  analytics: Analytics;
  fees: FeeConfig;
  filters: FilterState;
  activeFilter: FilterSheet;
  selectedNftId?: string;
  showFeed: boolean;
  showCart: boolean;
  showOffer: boolean;
  offerTargetId?: string;
  initMarket: () => void;
  setTab: (t: TabId) => void;
  setCategoryTab: (t: CategoryTab) => void;
  setStorageTab: (t: StorageTab) => void;
  setQuery: (q: string) => void;
  setFilterSheet: (f: FilterSheet) => void;
  setFilters: (f: Partial<FilterState>) => void;
  clearFilters: () => void;
  selectNft: (id?: string) => void;
  toggleCart: (listingId: string) => void;
  setShowFeed: (v: boolean) => void;
  setShowCart: (v: boolean) => void;
  setShowOffer: (v: boolean, targetId?: string) => void;
  buyNft: (listingId: string) => void;
  buyCart: () => void;
  listNft: (nftId: string, price: number) => void;
  cancelList: (nftId: string) => void;
  makeOffer: (listingId: string, price: number) => void;
  sellToOrder: (orderId: string) => void;
  tickMarket: () => void;
  addToast: (msg: string, type?: ToastEvent["type"]) => void;
  getFilteredMarket: () => NftListing[];
};

const addFeed = (feed: FeedEvent[], e: Omit<FeedEvent, "id" | "at">) =>
  [{ ...e, id: uid(), at: Date.now() }, ...feed].slice(0, 50);

export const useMarketStore = create<State>((set, get) => ({
  activeTab: "market",
  categoryTab: "gifts",
  storageTab: "vault",
  query: "",
  player: { ton: 10.3686, stars: 2500, username: "simulator_user" },
  market: [],
  marketReady: false,
  inventory: [],
  cart: [],
  buyOrders: [],
  feed: [],
  transactions: [],
  toasts: [],
  analytics: { totalProfitTon: 0, successfulFlips: 0, tradingVolumeTon: 0 },
  fees,
  filters: { models: [], backdrops: [], symbols: [] },
  activeFilter: null,
  selectedNftId: undefined,
  showFeed: false,
  showCart: false,
  showOffer: false,
  initMarket: () => {
    if (get().marketReady) return;
    const market = buildMarket();
    const starter = market.splice(0, 2).map((l) => listingToOwned(l, { acquiredAt: Date.now() - 86_400_000 }));
    set({ market, inventory: starter, buyOrders: buildOrders(), marketReady: true });
  },
  setTab: (t) => set({ activeTab: t, selectedNftId: undefined, showFeed: false, showCart: false }),
  setCategoryTab: (t) => set({ categoryTab: t }),
  setStorageTab: (t) => set({ storageTab: t }),
  setQuery: (q) => set({ query: q }),
  setFilterSheet: (f) => set({ activeFilter: f }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  clearFilters: () => set({ filters: { models: [], backdrops: [], symbols: [] } }),
  selectNft: (id) => set({ selectedNftId: id }),
  toggleCart: (id) =>
    set((s) => ({
      cart: s.cart.includes(id) ? s.cart.filter((x) => x !== id) : [...s.cart, id]
    })),
  setShowFeed: (v) => set({ showFeed: v }),
  setShowCart: (v) => set({ showCart: v }),
  setShowOffer: (v, targetId) => set({ showOffer: v, offerTargetId: targetId }),
  addToast: (message, type = "info") => {
    const id = uid();
    set((s) => ({
      toasts: [{ id, message, type, at: Date.now() }, ...s.toasts].slice(0, 4)
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  getFilteredMarket: () => {
    const { market, query, filters } = get();
    const q = query.toLowerCase();
    return market.filter((n) => {
      const byQ = !q || n.giftName.toLowerCase().includes(q) || String(n.serial).includes(q);
      const byModel = !filters.models.length || filters.models.includes(n.model);
      const byBg = !filters.backdrops.length || filters.backdrops.includes(n.backdropName);
      const bySym = !filters.symbols.length || filters.symbols.includes(n.symbolName);
      const byMin = filters.priceMin === undefined || n.priceTon >= filters.priceMin;
      const byMax = filters.priceMax === undefined || n.priceTon <= filters.priceMax;
      return byQ && byModel && byBg && bySym && byMin && byMax;
    });
  },
  buyNft: (listingId) => {
    const s = get();
    const listing = s.market.find((x) => x.id === listingId);
    if (!listing) return;
    const fee = calcFee(listing.priceTon);
    const total = listing.priceTon + fee;
    if (s.player.ton < total) {
      get().addToast("Недостаточно средств на балансе", "warning");
      return;
    }
    set((st) => ({
      player: { ...st.player, ton: Number((st.player.ton - total).toFixed(4)) },
      market: st.market.filter((x) => x.id !== listingId),
      cart: st.cart.filter((x) => x !== listingId),
      inventory: [listingToOwned(listing), ...st.inventory],
      transactions: [
        { id: uid(), giftName: listing.giftName, serial: listing.serial, type: "BUY", priceTon: listing.priceTon, feeTon: fee, at: Date.now() },
        ...st.transactions
      ],
      feed: addFeed(st.feed, { type: "SALE", ...feedMeta(listing) }),
      analytics: {
        ...st.analytics,
        tradingVolumeTon: Number((st.analytics.tradingVolumeTon + listing.priceTon).toFixed(2))
      }
    }));
    get().addToast(`Куплен ${listing.giftName} #${listing.serial}`, "success");
  },
  buyCart: () => {
    const ids = [...get().cart];
    ids.forEach((id) => get().buyNft(id));
    set({ showCart: false, cart: [] });
  },
  listNft: (nftId, price) => {
    const s = get();
    const nft = s.inventory.find((x) => x.id === nftId);
    if (!nft || nft.marketListingId) return;
    const listingId = uid();
    const listing: NftListing = {
      id: listingId,
      giftName: nft.giftName,
      serial: nft.serial,
      model: nft.model,
      modelRarityPermille: nft.modelRarityPermille,
      backdropName: nft.backdropName,
      symbolName: nft.symbolName,
      priceTon: price,
      sellerName: s.player.username,
      ownerName: s.player.username,
      instantDelivery: true,
      listedAt: Date.now()
    };
    set((st) => ({
      inventory: st.inventory.map((x) =>
        x.id === nftId
          ? { ...x, listedPriceTon: price, marketListingId: listingId, listExpiresAt: Date.now() + 16 * 86_400_000 }
          : x
      ),
      market: [listing, ...st.market],
      transactions: [
        { id: uid(), giftName: nft.giftName, serial: nft.serial, type: "LIST", priceTon: price, feeTon: 0, at: Date.now() },
        ...st.transactions
      ],
      feed: addFeed(st.feed, { type: "LISTING", ...feedMeta({ ...listing, priceTon: price }) })
    }));
    get().addToast(`Выставлен ${nft.giftName} #${nft.serial} за ${price} TON`, "info");
  },
  cancelList: (nftId) => {
    const nft = get().inventory.find((x) => x.id === nftId);
    if (!nft?.marketListingId) return;
    set((st) => ({
      market: st.market.filter((x) => x.id !== nft.marketListingId),
      inventory: st.inventory.map((x) =>
        x.id === nftId ? { ...x, listedPriceTon: undefined, marketListingId: undefined, listExpiresAt: undefined } : x
      ),
      feed: addFeed(st.feed, {
        type: "DELIST",
        giftName: nft.giftName,
        serial: nft.serial,
        priceTon: nft.listedPriceTon ?? 0,
        model: nft.model,
        backdropName: nft.backdropName,
        symbolName: nft.symbolName
      })
    }));
  },
  makeOffer: (listingId, price) => {
    const listing = get().market.find((x) => x.id === listingId);
    if (!listing || get().player.ton < price) {
      get().addToast("Недостаточно средств для оффера", "warning");
      return;
    }
    set((s) => ({
      player: { ...s.player, ton: Number((s.player.ton - price).toFixed(4)) },
      showOffer: false
    }));
    get().addToast(`Оффер ${price} TON на ${listing.giftName} #${listing.serial} отправлен`, "success");
  },
  sellToOrder: (orderId) => {
    const s = get();
    const order = s.buyOrders.find((x) => x.id === orderId);
    const nft = s.inventory.find((x) => x.giftName === order?.giftName && !x.marketListingId);
    if (!order || !nft) {
      get().addToast("Нет подходящего подарка в хранилище", "warning");
      return;
    }
    const fee = calcFee(order.priceTon);
    const net = Number((order.priceTon - fee).toFixed(2));
    const profit = Number((net - nft.boughtForTon).toFixed(2));
    set((st) => ({
      player: { ...st.player, ton: Number((st.player.ton + net).toFixed(4)) },
      inventory: st.inventory.filter((x) => x.id !== nft.id),
      transactions: [
        { id: uid(), giftName: nft.giftName, serial: nft.serial, type: "SELL", priceTon: order.priceTon, feeTon: fee, at: Date.now() },
        ...st.transactions
      ],
      analytics: {
        totalProfitTon: Number((st.analytics.totalProfitTon + profit).toFixed(2)),
        successfulFlips: st.analytics.successfulFlips + (profit > 0 ? 1 : 0),
        tradingVolumeTon: Number((st.analytics.tradingVolumeTon + order.priceTon).toFixed(2))
      }
    }));
    get().addToast(`Продан ${nft.giftName} по ордеру за ${order.priceTon} TON`, "success");
  },
  tickMarket: () => {
    if (!get().marketReady) return;
    const s = get();
    const names = useCatalogStore.getState().giftNames.length ? useCatalogStore.getState().giftNames : [...GIFT_NAMES];
    let market = [...s.market];
    let feed = [...s.feed];
    let inventory = [...s.inventory];
    let player = { ...s.player };
    let analytics = { ...s.analytics };

    if (Math.random() < 0.5 && market.length) {
      const idx = Math.floor(Math.random() * market.length);
      const base = market[idx];
      const cheaper = {
        ...base,
        id: uid(),
        priceTon: Number(Math.max(0.5, base.priceTon - 0.1 - Math.random() * 0.3).toFixed(2)),
        sellerName: pick(BOT_NAMES),
        listedAt: Date.now()
      };
      market.unshift(cheaper);
      feed = addFeed(feed, { type: "PRICE_CHANGE", ...feedMeta(cheaper) });
    }

    if (Math.random() < 0.35 && market.length > 5) {
      const botIdx = market.findIndex((x) => x.sellerName !== s.player.username);
      if (botIdx >= 0) {
        const sold = market[botIdx];
        market.splice(botIdx, 1);
        feed = addFeed(feed, { type: "SALE", ...feedMeta(sold) });
      }
    }

    const playerListing = market.find((x) => x.sellerName === s.player.username);
    if (playerListing) {
      const floor = market.filter((x) => x.giftName === playerListing.giftName).sort((a, b) => a.priceTon - b.priceTon)[0];
      const isFloor = floor?.id === playerListing.id;
      const whale = [1, 7, 77, 777, 16892, 54545].includes(playerListing.serial % 1000);
      if ((isFloor && Math.random() < 0.2) || (whale && Math.random() < 0.15)) {
        const price = whale ? Number((playerListing.priceTon * 1.25).toFixed(2)) : playerListing.priceTon;
        const fee = calcFee(price);
        const net = Number((price - fee).toFixed(2));
        const nft = inventory.find((x) => x.marketListingId === playerListing.id);
        const profit = Number((net - (nft?.boughtForTon ?? price)).toFixed(2));
        market = market.filter((x) => x.id !== playerListing.id);
        inventory = inventory.filter((x) => x.id !== nft?.id);
        player = { ...player, ton: Number((player.ton + net).toFixed(4)) };
        analytics = {
          totalProfitTon: Number((analytics.totalProfitTon + profit).toFixed(2)),
          successfulFlips: analytics.successfulFlips + (profit > 0 ? 1 : 0),
          tradingVolumeTon: Number((analytics.tradingVolumeTon + price).toFixed(2))
        };
        feed = addFeed(feed, { type: whale ? "OFFER_SALE" : "SALE", ...feedMeta({ ...playerListing, priceTon: price }) });
        get().addToast(
          whale ? `🐋 Whale купил #${playerListing.serial} за ${price} TON!` : `🎉 Продан #${playerListing.serial} за ${price} TON`,
          "success"
        );
      }
    }

    if (market.length < 60) {
      market.push(makeListing(pick(names), 20000 + Math.floor(Math.random() * 90000)));
    }

    set({ market, feed, inventory, player, analytics });
  }
}));

export const feedLabel = (t: FeedEventType) => {
  const map: Record<FeedEventType, string> = {
    SALE: "ПРОДАЖА",
    LISTING: "РАЗМЕЩЕНИЕ",
    PRICE_CHANGE: "ИЗМЕНЕНИЕ ЦЕНЫ",
    DELIST: "СНЯТИЕ С ПРОДАЖИ",
    OFFER_SALE: "ОФФЕР — ПРОДАЖА"
  };
  return map[t];
};

export const feedColor = (t: FeedEventType) => {
  const map: Record<FeedEventType, string> = {
    SALE: "text-success",
    LISTING: "text-mrkt-yellow",
    PRICE_CHANGE: "text-orange-400",
    DELIST: "text-textMuted",
    OFFER_SALE: "text-success"
  };
  return map[t];
};

export const rarityPct = (permille: number) => `${(permille / 10).toFixed(permille < 10 ? 1 : 0)}%`;
