export type TabId = "market" | "orders" | "hub" | "tasks" | "storage";
export type CategoryTab = "gifts" | "stickers" | "stars" | "collections";
export type FilterSheet = "model" | "backdrop" | "symbol" | "price" | null;
export type FeedEventType = "SALE" | "LISTING" | "PRICE_CHANGE" | "DELIST" | "OFFER_SALE";
export type StorageTab = "on_sale" | "vault";

export interface NftListing {
  id: string;
  giftName: string;
  serial: number;
  model: string;
  modelRarityPermille: number;
  backdropName: string;
  symbolName: string;
  priceTon: number;
  sellerName: string;
  ownerName: string;
  instantDelivery: boolean;
  listedAt: number;
}

export interface OwnedNft {
  id: string;
  giftName: string;
  serial: number;
  model: string;
  modelRarityPermille: number;
  backdropName: string;
  symbolName: string;
  boughtForTon: number;
  acquiredAt: number;
  listedPriceTon?: number;
  marketListingId?: string;
  listExpiresAt?: number;
}

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  giftName: string;
  serial: number;
  priceTon: number;
  model?: string;
  backdropName?: string;
  symbolName?: string;
  at: number;
}

export interface BuyOrder {
  id: string;
  giftName: string;
  quantity: number;
  priceTon: number;
}

export interface Transaction {
  id: string;
  giftName: string;
  serial: number;
  type: "BUY" | "SELL" | "LIST" | "DELIST";
  priceTon: number;
  feeTon: number;
  at: number;
}

export interface FeeConfig {
  gasTon: number;
  royaltyPct: number;
  platformPct: number;
}

export interface Analytics {
  totalProfitTon: number;
  successfulFlips: number;
  tradingVolumeTon: number;
}

export interface FilterState {
  models: string[];
  backdrops: string[];
  symbols: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface PlayerState {
  ton: number;
  stars: number;
  username: string;
}

export interface ToastEvent {
  id: string;
  message: string;
  type: "success" | "info" | "warning";
  at: number;
}
