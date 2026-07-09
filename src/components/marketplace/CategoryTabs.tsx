import { CategoryTab } from "../../types/market";
import { useMarketStore } from "../../store/marketStore";

const tabs: { id: CategoryTab; label: string }[] = [
  { id: "gifts", label: "Подарки" },
  { id: "stickers", label: "Стикеры" },
  { id: "stars", label: "Звёзды и Прем" },
  { id: "collections", label: "Коллекции" }
];

export function CategoryTabs() {
  const { categoryTab, setCategoryTab } = useMarketStore();

  return (
    <div className="flex gap-4 overflow-x-auto scroll-hide border-b border-border px-3">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setCategoryTab(t.id)}
          className={`tab-category ${categoryTab === t.id ? "tab-category-active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
