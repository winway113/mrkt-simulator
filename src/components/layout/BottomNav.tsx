import { TabId } from "../../types/market";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "market", label: "Маркет", icon: "🎁" },
  { id: "orders", label: "Ордеры", icon: "📋" },
  { id: "hub", label: "Игровой хаб", icon: "🎮" },
  { id: "tasks", label: "Задания", icon: "👻" },
  { id: "storage", label: "Хранилище", icon: "📦" }
];

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-bg">
      <div className="mx-auto flex max-w-[430px] items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)] pt-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-1.5 ${
              active === tab.id ? "text-textPrimary" : "text-textDim"
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[9px] font-medium leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
