import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Field } from "./ui/Field.jsx";
import { queryClient } from "../../utils/queryClient.js";
import { baseUrl } from "../../constants/global-variable.js";

const InputDepartamento = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState("");

    // Gatilho para abrir modal
    const trigger = React.Children.map(children, (child) =>
        React.cloneElement(child, { onClick: () => setOpen(true) })
    );

    // adicionar departamento
    const addMutation = useMutation({
        mutationFn: async (novoDepartamento) => {
        const res = await fetch(`${baseUrl}/departamentos`, {
            method: "POST",
            body: JSON.stringify(novoDepartamento),
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Falha ao adicionar departamento");
        return res.json();
        },
        onSuccess: () => {
        toast.success("Departamento adicionado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["departamentos"] });
        setNome("");
        setOpen(false);
        },
        onError: (err) => toast.error(err.message),
    });

    // Envio do formulário
    const handleSubmit = () => {
        if (!nome.trim()) {
        toast.error('O campo "nome" é obrigatório!');
        return;
        }
        addMutation.mutate({ nome });
    };

    return (
        <>
        {trigger}

        {open && (
            <div className="fixed inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
            <div className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-gray-900 border-gray-800 border-2 p-4 shadow-sm animate-slide-in-bottom">
                <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-white">
                    Adicionar Departamento
                </h2>
                </div>

                <div className="flex flex-col gap-4">
                <Field label="Nome" required>
                    <input
                    name="nome"
                    placeholder="Digite o nome do departamento"
                    className="input"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    />
                </Field>
                </div>

                <div className="flex justify-end gap-3 mt-10">
                <button className="btn btn-cancel" onClick={() => setOpen(false)}>
                    Cancelar
                </button>
                <button className="btn btn-save" onClick={handleSubmit}>
                    Adicionar
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
};

export default InputDepartamento;
