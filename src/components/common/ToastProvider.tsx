import { PropsWithChildren } from "react";
import { useMarketStore } from "../../store/marketStore";

export function ToastProvider({ children }: PropsWithChildren) {
  const toasts = useMarketStore((s) => s.toasts.slice(0, 2));

  return (
    <>
      {children}
      <div className="pointer-events-none fixed left-0 right-0 top-2 z-[70] mx-auto flex max-w-[430px] flex-col gap-2 px-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-in rounded-2xl px-4 py-3 text-sm font-medium shadow-card ${
              t.type === "success" ? "bg-success/20 text-success border border-success/30" :
              t.type === "warning" ? "bg-mrkt-yellow/15 text-mrkt-yellow border border-mrkt-yellow/30" :
              "bg-card border border-border text-textPrimary"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
