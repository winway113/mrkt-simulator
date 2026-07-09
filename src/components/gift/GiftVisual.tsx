import { useEffect, useState } from "react";
import { fragmentGiftPreviewUrl, fragmentGiftUrl } from "../../services/giftAssets";
import { useCatalogStore } from "../../store/catalogStore";
import type { BackdropData } from "../../services/giftAssets";
import { backdropStyleRaw } from "../../services/giftAssets";

interface Props {
  giftName: string;
  serial?: number;
  model: string;
  backdrop: BackdropData;
  symbol: string;
  className?: string;
  size?: "card" | "detail";
}

type ImgStage = "fragment" | "fragment-fallback" | "emoji";

export function GiftVisual({ giftName, serial, backdrop, className = "" }: Props) {
  const ensureGift = useCatalogStore((s) => s.ensureGift);
  const [stage, setStage] = useState<ImgStage>("fragment");

  useEffect(() => {
    ensureGift(giftName);
  }, [giftName, ensureGift]);

  useEffect(() => {
    setStage("fragment");
  }, [giftName, serial]);

  const fragmentSrc = serial ? fragmentGiftUrl(giftName, serial) : fragmentGiftPreviewUrl(giftName);
  const fallbackSrc = fragmentGiftPreviewUrl(giftName);
  const src = stage === "fragment" ? fragmentSrc : stage === "fragment-fallback" ? fallbackSrc : "";
  const showBackdrop = stage === "emoji";

  const onImgError = () => {
    setStage((current) => {
      if (current === "fragment") return "fragment-fallback";
      if (current === "fragment-fallback") return "emoji";
      return current;
    });
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={showBackdrop ? backdropStyleRaw(backdrop) : undefined}
    >
      {stage !== "emoji" && src ? (
        <img
          src={src}
          alt={giftName}
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
          onError={onImgError}
        />
      ) : (
        <span className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-4xl">🎁</span>
      )}
    </div>
  );
}
