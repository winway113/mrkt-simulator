import { create } from "zustand";
import { GIFT_NAMES } from "../data/giftNames";
import { FALLBACK_BACKDROPS } from "../data/fallbackBackdrops";
import {
  BackdropData,
  fetchBackdrops,
  fetchGiftModels,
  fetchGiftNames,
  fetchGiftSymbols
} from "../services/giftAssets";

export type CatalogModel = { name: string; rarityPermille: number };
export type CatalogSymbol = { name: string; rarityPermille: number };

type CatalogState = {
  giftNames: string[];
  backdrops: BackdropData[];
  modelsCache: Record<string, CatalogModel[]>;
  symbolsCache: Record<string, CatalogSymbol[]>;
  loaded: boolean;
  init: () => void;
  ensureGift: (giftName: string) => Promise<void>;
  getModels: (giftName: string) => CatalogModel[];
  getSymbols: (giftName: string) => CatalogSymbol[];
  getBackdrops: () => BackdropData[];
};

const PRELOAD_GIFTS = ["Plush Pepe", "Lunar Snake", "Evil Eye", "Liberty Figure", "Ginger Cookie", "Berry Box"];

export const useCatalogStore = create<CatalogState>((set, get) => ({
  giftNames: [...GIFT_NAMES],
  backdrops: FALLBACK_BACKDROPS,
  modelsCache: {},
  symbolsCache: {},
  loaded: false,
  init: () => {
    if (get().loaded) return;
    set({ giftNames: [...GIFT_NAMES], backdrops: FALLBACK_BACKDROPS, loaded: true });

    void (async () => {
      const [giftNames, backdrops] = await Promise.all([fetchGiftNames(), fetchBackdrops()]);
      set({
        giftNames: giftNames.length ? giftNames : get().giftNames,
        backdrops: backdrops.length ? backdrops : get().backdrops
      });

      for (const giftName of PRELOAD_GIFTS) {
        await get().ensureGift(giftName).catch(() => {});
      }
    })();
  },
  ensureGift: async (giftName) => {
    const { modelsCache, symbolsCache } = get();
    if (modelsCache[giftName]?.length && symbolsCache[giftName]?.length) return;

    const [models, symbols] = await Promise.all([
      modelsCache[giftName]?.length ? modelsCache[giftName] : fetchGiftModels(giftName),
      symbolsCache[giftName]?.length ? symbolsCache[giftName] : fetchGiftSymbols(giftName)
    ]);

    if (!models.length && !symbols.length) return;

    set((s) => ({
      modelsCache: models.length ? { ...s.modelsCache, [giftName]: models } : s.modelsCache,
      symbolsCache: symbols.length ? { ...s.symbolsCache, [giftName]: symbols } : s.symbolsCache
    }));
  },
  getModels: (giftName) => get().modelsCache[giftName] ?? [],
  getSymbols: (giftName) => get().symbolsCache[giftName] ?? [],
  getBackdrops: () => get().backdrops
}));
