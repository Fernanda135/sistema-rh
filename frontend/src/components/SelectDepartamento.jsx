import React from "react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constants/global-variable.js";

const SelectDepartamento = ({ value, onChange }) => {
  // Busca departamentos
  const { data: departamentos = [], isLoading } = useQuery({
    queryKey: ["departamentos"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/departamentos`);
      if (!res.ok) throw new Error("Erro ao buscar departamentos");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-gray-400">Carregando departamentos...</p>;

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-white">
        Departamento<span className="text-red-500 ml-0.5">*</span>
      </label>
      <select
        value={value}
        className="input"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        <option value="">Selecione o departamento</option>
        {departamentos.map((dpt) => (
          <option key={dpt.id} value={dpt.id}>
            {dpt.nome}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectDepartamento;
