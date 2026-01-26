import React, { useState, useEffect } from "react";
import { Field } from "./ui/Field.jsx";
import SelectCargo from "./SelectCargo.jsx";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../utils/queryClient.js";
import { baseUrl } from "../../constants/global-variable.js";

const InputFuncionario = ({ children, type = "add", data }) => {

    const trigger = React.Children.map(children, (child) => {
        return React.cloneElement(child, {
            onClick: () => setOpen(true),
        });
    });

    useEffect(() => {
        if (type === "edit" && data) {
            setInfo(data);
        }
    }, [data, type]);

    const [info, setInfo] = useState(
        type === "add" ? { nome: "", email: "", idade: "", salario: "", cargo: "" } : data
    );

    function handleChange(e) {
        setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    console.log(info);

    const addMutation = useMutation({
        mutationFn: async (novoFuncionario) => {
            const response = await fetch(baseUrl, {
                method: "POST",
                body: JSON.stringify(novoFuncionario),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Falha ao adicionar funcionário");
            return response.json();
        },
        onSuccess: () => {
            toast.success("Funcionário adicionado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
            queryClient.invalidateQueries({ queryKey: ["media-salarial"] });
            setOpen(false);
            setInfo({ nome: "", email: "", idade: "", salario: "", cargo: "" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (info) => {
            const response = await fetch(`${baseUrl}/${info.id}`, {
                method: "PUT",
                body: JSON.stringify(info),
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error("Falha ao atualizar funcionário");
            return response.json();
        },
        onSuccess: () => {
            toast.success("Funcionário atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
            queryClient.invalidateQueries({ queryKey: ["media-salarial"] });
            setOpen(false);
        }
    });

    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        const camposObrigatorios = ["nome", "idade", "salario", "email", "cargo"];
        for (const key of camposObrigatorios) {
            if (!info[key]?.toString().trim()) {
                toast.error(`Campo "${key}" está faltando!`);
                return;
            }
        }

        if (type === "add") {
            addMutation.mutate(info);
        } else {
            updateMutation.mutate(info);
        }
    };

    return (
        <>
            {trigger}

            {open && (
                <div className="fixed inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
                    <div className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-gray-900 border-gray-800 border-2 p-4 shadow-sm animate-slide-in-bottom">

                        {/* Cabeçalho com título */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-semibold text-white">
                                {type === "add" ? "Adicionar Funcionário" : "Atualizar Funcionário"}
                            </h2>
                        </div>

                        {/* Campos de entrada */}
                        <div className="flex flex-col gap-4">
                            <Field label="Nome" required>
                                <input
                                    name="nome"
                                    placeholder="Digite o nome"
                                    className="input"
                                    value={info.nome}
                                    onChange={handleChange}
                                />
                            </Field>
                            <Field label="Email" required>
                                <input
                                    name="email"
                                    placeholder="Digite o email"
                                    className="input"
                                    value={info.email}
                                    onChange={handleChange}
                                />
                            </Field>
                            <Field label="Idade" required>
                                <input
                                    name="idade"
                                    type="number"
                                    placeholder="Digite a idade"
                                    className="input"
                                    value={info.idade}
                                    onChange={handleChange}
                                />
                            </Field>
                            <Field label="Salário" required>
                                <input
                                    name="salario"
                                    placeholder="Digite o salário"
                                    className="input"
                                    value={info.salario}
                                    onChange={handleChange}
                                />
                            </Field>
                            <SelectCargo
                                value={info.cargo}
                                onChange={(cargo) =>
                                    setInfo((prev) => ({ ...prev, cargo }))
                                }
                            />

                        </div>

                        {/* Botões */}
                        <div className="flex justify-end gap-3 mt-10">
                            <button
                                onClick={() => setOpen(false)}
                                className="btn btn-cancel"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-save"
                            >
                                {type === "add" ? "Adicionar" : "Atualizar"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default InputFuncionario;
