import { useEffect, useState } from "react";
import {
  backdropStyleRaw,
  fragmentGiftPreviewUrl,
  fragmentGiftUrl,
  modelImageUrl,
  originalGiftUrl,
  patternImageUrl
} from "../../services/giftAssets";
import { useCatalogStore } from "../../store/catalogStore";
import type { BackdropData } from "../../services/giftAssets";

interface Props {
  giftName: string;
  serial?: number;
  model: string;
  backdrop: BackdropData;
  symbol: string;
  className?: string;
  size?: "card" | "detail";
}

type ImgStage = "model" | "original" | "fragment" | "emoji";

export function GiftVisual({ giftName, serial, model, backdrop, symbol, className = "", size = "card" }: Props) {
  const ensureGift = useCatalogStore((s) => s.ensureGift);
  const [stage, setStage] = useState<ImgStage>(() => (model && model !== "Original" ? "model" : "original"));
  const [showPattern, setShowPattern] = useState(true);

  useEffect(() => {
    ensureGift(giftName);
  }, [giftName, ensureGift]);

  useEffect(() => {
    setStage(model && model !== "Original" ? "model" : "original");
    setShowPattern(true);
  }, [giftName, model]);

  const modelSrc = modelImageUrl(giftName, model, size === "detail" ? 512 : 256);
  const originalSrc = originalGiftUrl(giftName, size === "detail" ? 512 : 256);
  const fragmentSrc = serial ? fragmentGiftUrl(giftName, serial) : fragmentGiftPreviewUrl(giftName);

  const src =
    stage === "model" ? modelSrc : stage === "original" ? originalSrc : stage === "fragment" ? fragmentSrc : "";

  const isFragment = stage === "fragment";
  const patternUrl = symbol ? patternImageUrl(giftName, symbol) : "";
  const imgSize = size === "detail" ? "max-w-[72%] max-h-[72%]" : "max-w-[80%] max-h-[80%]";

  const onImgError = () => {
    setStage((current) => {
      if (current === "model") return "original";
      if (current === "original") return "fragment";
      if (current === "fragment") return "emoji";
      return current;
    });
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={isFragment ? undefined : backdropStyleRaw(backdrop)}
    >
      {!isFragment && symbol && showPattern && (
        <img
          src={patternUrl}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18]"
          loading="eager"
          decoding="async"
          onError={() => setShowPattern(false)}
        />
      )}
      {stage !== "emoji" && src ? (
        <img
          src={src}
          alt={giftName}
          className={
            isFragment
              ? "h-full w-full object-cover"
              : `absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-lg ${imgSize}`
          }
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
