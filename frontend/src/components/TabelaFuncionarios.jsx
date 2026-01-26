import React from 'react';
import { Pencil, Trash2 } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { baseUrl } from '../../constants/global-variable.js';
import toast from 'react-hot-toast';
import { queryClient } from "../../utils/queryClient.js";
import InputFuncionario from './InputFuncionario.jsx';


const TabelaFuncionarios = ({ data }) => {

    if (!data || data.length === 0) {
        return <h1>Você não possui dados de funcionários!</h1>;
    }


    const mutation = useMutation({
        mutationFn: async (id) => {
            console.log("Função de mutation: ", id);

            const response = await fetch(`${baseUrl}/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const dados = await response.json();

            if (!response.ok) {
                throw new Error(dados.erro);
            }
            return dados;
        },
        onSuccess: () => {
            toast.success("Funcionário deletado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["funcionarios"] });
            queryClient.invalidateQueries({ queryKey: ["media-salarial"] });
        },
        onError: (erro) => {
            console.log(erro.message);
            toast.error(erro.message);
        }
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
                            <th>Cargo</th>
                            <th>Salário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} >
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.email}</td>
                                <td>{item.idade}</td>
                                <td>{item.cargo}</td>
                                <td>R$ {item.salario}</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <InputFuncionario data={item} type='edit'>
                                            <button className="text-blue-400 hover:text-blue-500 transition cursor-pointer">
                                                <Pencil size={15} />
                                            </button>
                                        </InputFuncionario>

                                        <button
                                            className="text-red-400 hover:text-red-500 transition cursor-pointer"
                                            onClick={() => mutation.mutate(item.id)}
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
}

export default TabelaFuncionarios;
