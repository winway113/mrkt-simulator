interface Props {
  prices: number[];
}

export function PriceChart({ prices }: Props) {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 320;
  const h = 80;
  const pts = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl bg-card p-3">
      <p className="mb-2 text-xs font-semibold text-textMuted">История цены</p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <polyline fill="none" stroke="#f5c518" strokeWidth="2" points={pts} />
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-textDim">
        <span>{min.toFixed(2)} TON</span>
        <span>{max.toFixed(2)} TON</span>
      </div>
    </div>
  );
}
