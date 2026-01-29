import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import SelectDepartamento from "./SelectDepartamento.jsx";
import { baseUrl } from "../../constants/global-variable";
import { queryClient } from "../../utils/queryClient";

const ReajusteSalarial = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [departamentoId, setDepartamentoId] = useState("");
    const [percentual, setPercentual] = useState("");

    // aplicar reajuste
    const mutation = useMutation({
        mutationFn: async () => {
        const response = await fetch(`${baseUrl}/reajuste`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
            departamento_id: departamentoId, 
            percentual: Number(percentual) 
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.erro || "Erro ao aplicar reajuste");
        return data;
        },
        onSuccess: () => {
        toast.success("Salários reajustados com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
        queryClient.invalidateQueries({ queryKey: ["media-salarial-departamentos"] });
        setOpen(false);
        setDepartamentoId("");
        setPercentual("");
        },
        onError: (err) => toast.error(err.message),
    });

    // Gatilho para abrir modal
    const trigger = React.Children.map(children, (child) =>
        React.cloneElement(child, { onClick: () => setOpen(true) })
    );

    return (
        <>
        {trigger}

        {open && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-gray-900 border border-gray-800 p-6">

                <h2 className="text-xl font-semibold text-white mb-4">Reajuste Salarial</h2>

                <div className="space-y-4">
                <SelectDepartamento 
                    value={departamentoId} 
                    onChange={setDepartamentoId} 
                />
                <input 
                    type="number" 
                    placeholder="Percentual (%)" 
                    value={percentual} 
                    onChange={(e) => setPercentual(e.target.value)} 
                    className="input" 
                />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setOpen(false)} className="btn btn-cancel">
                    Cancelar
                </button>

                <button 
                    type="button" 
                    className="btn btn-save" 
                    onClick={() => {
                    if (!departamentoId || !percentual) {
                        toast.error("Selecione o departamento e informe o percentual");
                        return;
                    }
                    mutation.mutate();
                    }}
                >
                    Aplicar
                </button>
                </div>

            </div>
            </div>
        )}
        </>
    );
};

export default ReajusteSalarial;
