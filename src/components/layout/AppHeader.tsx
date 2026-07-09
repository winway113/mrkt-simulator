import { DiamondIcon } from "./DiamondIcon";
import { useMarketStore } from "../../store/marketStore";

export function AppHeader() {
  const { player } = useMarketStore();

  return (
    <header className="px-3 pt-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-bold">
            S
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-mrkt-yellow text-[9px] font-bold text-black">
              2
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-card px-2.5 py-1.5">
            <DiamondIcon size={13} />
            <span className="text-sm font-bold">{player.ton.toFixed(4)}</span>
            <button className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card2 text-xs text-textMuted">+</button>
          </div>
        </div>
        <div className="flex items-center gap-3 text-lg">
          <span className="opacity-80">👜</span>
          <span className="opacity-80">📣</span>
          <span className="opacity-80">☰</span>
        </div>
      </div>
    </header>
  );
}
