import { NftListing } from "../../types/market";
import { GiftListingVisual } from "../gift/GiftListingVisual";
import { DiamondIcon } from "../layout/DiamondIcon";

interface Props {
  nft: NftListing;
  onOpen: () => void;
}

export function NftCard({ nft, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full overflow-hidden rounded-2xl bg-card text-left transition active:scale-[0.97]"
    >
      <div className="relative aspect-square w-full">
        <GiftListingVisual nft={nft} />
        {nft.instantDelivery && (
          <span className="absolute bottom-1.5 left-1 right-1 z-20 rounded-lg bg-black/55 px-1 py-0.5 text-center text-[7px] font-medium leading-tight text-white">
            Мгновенная доставка
          </span>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 border-t border-white/5 py-2">
        <DiamondIcon size={12} />
        <span className="text-xs font-bold tracking-tight">{nft.priceTon.toFixed(2)}</span>
      </div>
    </button>
  );
}
