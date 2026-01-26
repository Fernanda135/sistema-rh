import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../constants/global-variable.js";

const Auditoria = ({ children }) => {
    const [open, setOpen] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["auditoria"],
        queryFn: async () => {
            const response = await fetch(`${baseUrl}/auditoria`);
            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados.message || "Erro ao buscar auditoria");
            }

            return dados;
        },
        enabled: false
    });

    const trigger = React.Children.map(children, (child) =>
        React.cloneElement(child, {
            onClick: () => {
                setOpen(true);
                if (!data) refetch();
            }
        })
    );

    return (
        <>
            {trigger}

            {open && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
                    <div className="relative w-4/5 max-w-6xl rounded-lg bg-gray-900 border border-gray-800 p-6 shadow-lg">

                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">
                                Auditoria de Funcionários
                            </h2>

                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-white cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Conteúdo */}
                        {isLoading && (
                            <p className="text-gray-300">Carregando auditoria...</p>
                        )}

                        {isError && (
                            <p className="text-red-500">{error.message}</p>
                        )}

                        {data && data.length === 0 && (
                            <p className="text-gray-400">
                                Nenhum registro de auditoria encontrado.
                            </p>
                        )}

                        {data && data.length > 0 && (
                            <div className="table-wrapper max-h-[60vh] overflow-y-auto overflow-x-auto">
                                <table className="table-aud">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Id_Funcionário</th>
                                            <th>Operação</th>
                                            <th>Antes</th>
                                            <th>Depois</th>
                                            <th>Data</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {data.map((item) => (
                                            <tr key={item.id} className="">
                                                <td className="">{item.id}</td>

                                                <td className="">
                                                    {item.funcionario_id}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-semibold
                                                            ${item.operacao === "INSERT" && "bg-green-500/10 text-green-400"}
                                                            ${item.operacao === "UPDATE" && "bg-blue-500/10 text-blue-400"}
                                                            ${item.operacao === "DELETE" && "bg-red-500/10 text-red-400"}
                                                        `}
                                                    >
                                                        {item.operacao}
                                                    </span>
                                                </td>

                                                {/* ANTES */}
                                                <td>
                                                    {item.dados_antes ? (
                                                        <div className="bg-gray-900 border border-gray-700 rounded p-2 text-xs space-y-1">
                                                            {Object.entries(item.dados_antes).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <span className="text-gray-400">{key}:</span>{" "}
                                                                    <span className="text-gray-200">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">—</span>
                                                    )}
                                                </td>

                                                {/* DEPOIS */}
                                                <td>
                                                    {item.dados_depois ? (
                                                        <div className="bg-gray-900 border border-gray-700 rounded p-2 text-xs space-y-1">
                                                            {Object.entries(item.dados_depois).map(([key, value]) => (
                                                                <div key={key}>
                                                                    <span className="text-gray-400">{key}:</span>{" "}
                                                                    <span className="text-gray-200">{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">—</span>
                                                    )}
                                                </td>

                                                <td className="text-gray-400 text-sm">
                                                    {new Date(item.data_operacao).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Auditoria;
