import React from "react";
import { useQuery } from "@tanstack/react-query";

import TabelaFuncionarios from "./components/TabelaFuncionarios.jsx";
import InputFuncionario from "./components/InputFuncionario.jsx";
import Auditoria from "./components/Auditoria.jsx";
import ReajusteSalarial from "./components/ReajusteSalarial.jsx";
import CardsDepartamentos from "./components/CardsDepartamentos.jsx";
import InputDepartamento from "./components/InputDepartamento.jsx";

import { baseUrl } from "../constants/global-variable.js";

const App = () => {
  // buscar funcionários
  async function buscarFuncionarios() {
    const res = await fetch(baseUrl);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao buscar funcionários");
    return data;
  }

  // carregar funcionários
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["funcionarios"],
    queryFn: buscarFuncionarios,
  });

  if (isPending) return "Carregando...";
  if (isError) return error.message;

  console.log("Dados do PostgreSQL:", data);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl">

        {/* Título */}
        <h1 className="title">Gerenciamento de RH</h1>

        {/* Seção Departamentos */}
        <div className="container-dpt">
          <h2 className="subtitle">Departamentos</h2>

          <InputDepartamento>
            <button className="btn btn-primary">Adicionar Departamento</button>
          </InputDepartamento>

          <h3 className="mt-4">Média Salarial</h3>
          <CardsDepartamentos />
        </div>

        {/* Seção Funcionários */}
        <div className="container-func">
          <h2 className="subtitle">Funcionários</h2>

          <InputFuncionario>
            <button className="btn btn-primary">Adicionar Funcionário</button>
          </InputFuncionario>

          {/* Botão auditoria */}
          <Auditoria>
            <button className="btn btn-primary ml-4">Auditoria</button>
          </Auditoria>

          {/* Botão reajuste salarial */}
          <ReajusteSalarial>
            <button className="btn btn-primary ml-4">Reajustar Salários</button>
          </ReajusteSalarial>

          {/* Tabela de funcionários */}
          <TabelaFuncionarios data={data} />
        </div>

      </div>
    </div>
  );
};

export default App;
