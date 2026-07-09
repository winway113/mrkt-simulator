import { useMarketStore } from "../../store/marketStore";

export function FilterChips() {
  const { activeFilter, setFilterSheet, filters } = useMarketStore();
  const activeCount =
    filters.models.length + filters.backdrops.length + filters.symbols.length +
    (filters.priceMin !== undefined || filters.priceMax !== undefined ? 1 : 0);

  const chips = [
    { key: "model" as const, label: "Модель" },
    { key: "backdrop" as const, label: "Фон" },
    { key: "symbol" as const, label: "Символ" },
    { key: "price" as const, label: "Цена" }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto scroll-hide px-3 py-2">
      <button className="chip-filter flex items-center gap-1">
        ⚙️ {activeCount > 0 && <span className="text-mrkt-yellow">{activeCount}</span>}
      </button>
      <span className="chip-filter">NFT ▾</span>
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={() => setFilterSheet(activeFilter === c.key ? null : c.key)}
          className={`chip-filter ${activeFilter === c.key ? "chip-filter-active" : ""}`}
        >
          {c.label} ▾
        </button>
      ))}
    </div>
  );
}
