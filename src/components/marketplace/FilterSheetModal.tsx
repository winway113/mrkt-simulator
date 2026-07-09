import { useMemo } from "react";
import { useCatalogStore } from "../../store/catalogStore";
import { rarityPct, useMarketStore } from "../../store/marketStore";
import { FilterSheet } from "../../types/market";
import { DiamondIcon } from "../layout/DiamondIcon";

const titles: Record<Exclude<FilterSheet, null>, string> = {
  model: "Модель",
  backdrop: "Фон",
  symbol: "Символ",
  price: "Цена"
};

export function FilterSheetModal() {
  const { activeFilter, setFilterSheet, filters, setFilters, clearFilters } = useMarketStore();
  const backdrops = useCatalogStore((s) => s.backdrops);
  const modelsCache = useCatalogStore((s) => s.modelsCache);
  const symbolsCache = useCatalogStore((s) => s.symbolsCache);

  const models = useMemo(() => {
    const map = new Map<string, number>();
    Object.values(modelsCache).forEach((arr) =>
      arr.forEach((m) => {
        if (!map.has(m.name) || (map.get(m.name) ?? 999) > m.rarityPermille) map.set(m.name, m.rarityPermille);
      })
    );
    return [...map.entries()].map(([name, rarityPermille]) => ({ name, rarityPermille })).sort((a, b) => a.name.localeCompare(b.name));
  }, [modelsCache]);

  const symbols = useMemo(() => {
    const map = new Map<string, number>();
    Object.values(symbolsCache).forEach((arr) =>
      arr.forEach((s) => {
        if (!map.has(s.name)) map.set(s.name, s.rarityPermille);
      })
    );
    return [...map.entries()].map(([name, rarityPermille]) => ({ name, rarityPermille })).sort((a, b) => a.name.localeCompare(b.name));
  }, [symbolsCache]);

  if (!activeFilter) return null;

  const toggle = (key: "models" | "backdrops" | "symbols", value: string) => {
    const arr = filters[key];
    setFilters({ [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 animate-fade-in" onClick={() => setFilterSheet(null)}>
      <div className="max-h-[80vh] w-full animate-slide-up rounded-t-3xl bg-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-bold">{titles[activeFilter]}</h2>
          <button onClick={() => setFilterSheet(null)} className="text-xl text-textMuted">
            ✕
          </button>
        </div>

        {activeFilter !== "price" && (
          <div className="border-b border-border px-4 py-2">
            <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2">
              <span className="text-textDim">🔍</span>
              <input placeholder="Поиск" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
        )}

        <div className="max-h-[50vh] overflow-y-auto scroll-hide px-4 py-2">
          {activeFilter === "model" &&
            models.map((m) => (
              <FilterRow
                key={m.name}
                label={m.name}
                sub={rarityPct(m.rarityPermille)}
                checked={filters.models.includes(m.name)}
                onToggle={() => toggle("models", m.name)}
              />
            ))}
          {activeFilter === "backdrop" &&
            backdrops.map((b) => (
              <FilterRow
                key={b.name}
                label={b.name}
                color={b.hex.centerColor}
                checked={filters.backdrops.includes(b.name)}
                onToggle={() => toggle("backdrops", b.name)}
              />
            ))}
          {activeFilter === "symbol" &&
            symbols.map((s) => (
              <FilterRow
                key={s.name}
                label={s.name}
                checked={filters.symbols.includes(s.name)}
                onToggle={() => toggle("symbols", s.name)}
              />
            ))}
          {activeFilter === "price" && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-3">
                <DiamondIcon size={12} />
                <input
                  type="number"
                  placeholder="От"
                  className="w-full bg-transparent text-sm outline-none"
                  onChange={(e) => setFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              <span className="text-textDim">—</span>
              <input
                type="number"
                placeholder="До"
                className="flex-1 rounded-xl bg-surface px-3 py-3 text-sm outline-none"
                onChange={(e) => setFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border p-4 pb-8">
          <button onClick={clearFilters} className="btn-dark flex-1 py-3 text-sm">
            Очистить все
          </button>
          <button onClick={() => setFilterSheet(null)} className="btn-yellow flex-[2] py-3 text-sm">
            Показать результаты
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterRow({
  label,
  sub,
  color,
  checked,
  onToggle
}: {
  label: string;
  sub?: string;
  color?: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex w-full items-center gap-3 border-b border-border/50 py-3 text-left">
      {color && <span className="h-8 w-8 shrink-0 rounded-full" style={{ background: color }} />}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        {sub && <span className="rounded bg-mrkt-yellow/20 px-1.5 text-[10px] font-bold text-mrkt-yellow">{sub}</span>}
      </div>
      <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${checked ? "border-mrkt-yellow bg-mrkt-yellow" : "border-textDim"}`}>
        {checked && <span className="text-[10px] text-black">✓</span>}
      </span>
    </button>
  );
}
