import React from "react";

const SelectCargo = ({ value, onChange }) => {
    const cargos = [
        { value: "", label: "Selecione o cargo" },
        { value: "Desenvolvedor", label: "Desenvolvedor" },
        { value: "RH", label: "RH" },
        { value: "Estagiário", label: "Estagiário" },
        { value: "Vendas", label: "Vendas" },
        { value: "Gerente", label: "Gerente" },
    ];

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-white">
                Cargo<span className="text-red-500 ml-0.5">*</span>
            </label>

            <select value={value} className="input" onChange={(e) => onChange(e.target.value)} >
                {cargos.map((c) => (
                    <option key={c.value} value={c.value}>
                        {c.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectCargo;
