import React from "react";

export function BotaoFechar({ aoClicar }) {
  return (
    <button
      onClick={aoClicar}
      className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white"
    >
      ✕
    </button>
  );
}
