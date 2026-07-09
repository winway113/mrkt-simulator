/** Gift asset URLs via api.changes.tg — attribution required in app UI */

import { GIFT_NAMES } from "../data/giftNames";
import { FALLBACK_BACKDROPS } from "../data/fallbackBackdrops";

function changesApiBase() {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "/gift-api";
  }
  return "https://api.changes.tg";
}

const FETCH_TIMEOUT_MS = 8_000;

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  } finally {
    window.clearTimeout(timer);
  }
}

const FRAGMENT = "https://nft.fragment.com";

export function enc(s: string) {
  return encodeURIComponent(s);
}

export function giftSlug(giftName: string) {
  return giftName.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "");
}

export function fragmentGiftUrl(giftName: string, serial: number) {
  const n = (serial % 4999) + 1;
  return `${FRAGMENT}/gift/${giftSlug(giftName)}-${n}.webp`;
}

export function fragmentGiftPreviewUrl(giftName: string) {
  return `${FRAGMENT}/gift/${giftSlug(giftName)}-1.webp`;
}

export function modelImageUrl(giftName: string, modelName: string, size = 256) {
  return `${changesApiBase()}/model/${enc(giftName)}/${enc(modelName)}.png?size=${size}`;
}

export function patternImageUrl(giftName: string, symbolName: string) {
  return `${changesApiBase()}/pattern/${enc(giftName)}/${enc(symbolName)}.png`;
}

export function originalGiftUrl(giftName: string, size = 256) {
  return `${changesApiBase()}/original/${enc(giftName)}.png?size=${size}`;
}

export async function fetchGiftModels(giftName: string): Promise<{ name: string; rarityPermille: number }[]> {
  return fetchJson(`${changesApiBase()}/models/${enc(giftName)}`, []);
}

export async function fetchGiftSymbols(giftName: string): Promise<{ name: string; rarityPermille: number }[]> {
  return fetchJson(`${changesApiBase()}/symbols/${enc(giftName)}`, []);
}

export interface BackdropData {
  name: string;
  backdropId: number;
  hex: {
    centerColor: string;
    edgeColor: string;
    patternColor: string;
    textColor: string;
  };
}

export async function fetchBackdrops(): Promise<BackdropData[]> {
  return fetchJson(`${changesApiBase()}/backdrops`, FALLBACK_BACKDROPS);
}

export async function fetchGiftNames(): Promise<string[]> {
  const idMap = await fetchJson<Record<string, string>>("https://cdn.changes.tg/gifts/id-to-name.json", {});
  const fromCdn = Object.values(idMap);
  if (fromCdn.length) return fromCdn;

  const names = await fetchJson<string[]>(`${changesApiBase()}/gifts`, []);
  return names.length ? names : [...GIFT_NAMES];
}

export function backdropStyleRaw(backdrop: BackdropData) {
  return {
    background: `radial-gradient(circle at 50% 35%, ${backdrop.hex.centerColor} 0%, ${backdrop.hex.edgeColor} 100%)`
  };
}
