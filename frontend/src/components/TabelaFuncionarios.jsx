import React from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { baseUrl } from '../../constants/global-variable.js';
import { queryClient } from "../../utils/queryClient.js";
import InputFuncionario from './InputFuncionario.jsx';

const TabelaFuncionarios = () => {
    
    // Buscar funcionários com departamento
    const { data = [], isLoading, isError, error } = useQuery({
        queryKey: ["funcionarios"],
        queryFn: async () => {
            const res = await fetch(`${baseUrl}/com-departamento`);
            if (!res.ok) throw new Error("Erro ao buscar funcionários");
            return res.json();
        }
    });



    // carregamento e erro
    if (isLoading) return <p>Carregando funcionários...</p>;
    if (isError) return <p className='text-red-500'>Erro: {error.message}</p>;
    if (!data || data.length === 0) return <p className='text-gray-400'>Nenhum funcionário encontrado.</p>;

    // deletar funcionário
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`${baseUrl}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
            const err = await res.json();
            throw new Error(err.erro || "Erro ao deletar funcionário");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Funcionário deletado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
        },
        });


    return (
        <div className="pt-5">
        <div className="table-wrapper">
            <table className="table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Idade</th>
                <th>Departamento</th>
                <th>Salário</th>
                <th>Ações</th>
                </tr>
            </thead>

            <tbody>
                {data.map((func) => (
                <tr key={func.id}>
                    <td>{func.id}</td>
                    <td>{func.nome}</td>
                    <td>{func.email}</td>
                    <td>{func.idade}</td>
                    <td>{func.departamento_nome ?? "—"}</td>
                    <td>R$ {Number(func.salario).toFixed(2)}</td>

                    <td>
                    <div className="flex items-center gap-3">

                        <InputFuncionario data={func} type="edit">
                        <button className="text-blue-400 hover:text-blue-500 transition cursor-pointer">
                            <Pencil size={15} />
                        </button>
                        </InputFuncionario>

                        <button
                        className="text-red-400 hover:text-red-500 transition cursor-pointer"
                        onClick={() => {deleteMutation.mutate(func.id);
                        }}
                        >
                        <Trash2 size={15} />
                        </button>

                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default TabelaFuncionarios;
