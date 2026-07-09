import { useMemo } from "react";
import { FALLBACK_BACKDROPS } from "../../data/fallbackBackdrops";
import { useCatalogStore } from "../../store/catalogStore";
import { GiftVisual } from "./GiftVisual";

interface NftVisual {
  giftName: string;
  serial: number;
  model: string;
  backdropName: string;
  symbolName: string;
}

interface Props {
  nft: NftVisual;
  className?: string;
  size?: "card" | "detail";
}

export function GiftListingVisual({ nft, className = "", size = "card" }: Props) {
  const backdrops = useCatalogStore((s) => s.backdrops);
  const backdrop = useMemo(
    () => backdrops.find((b) => b.name === nft.backdropName) ?? FALLBACK_BACKDROPS[0],
    [backdrops, nft.backdropName]
  );

  return (
    <div className={`relative overflow-hidden ${className || "absolute inset-0"}`}>
      <GiftVisual
        giftName={nft.giftName}
        serial={nft.serial}
        model={nft.model}
        backdrop={backdrop}
        symbol={nft.symbolName}
        size={size}
      />
    </div>
  );
}
