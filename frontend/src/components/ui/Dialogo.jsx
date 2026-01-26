import { useEffect } from "react";
import { BotaoFechar } from "./BotaoFechar";

export function Dialogo({ aberto, aoFechar, children }) {
  // Bloqueia o scroll do body enquanto o diálogo estiver aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "auto";
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
        <BotaoFechar onClick={aoFechar} />
        {children}
      </div>
    </div>
  );
}
