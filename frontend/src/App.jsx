import React from "react";
import TabelaFuncionarios from "./components/TabelaFuncionarios.jsx";
import InputFuncionario from "./components/InputFuncionario.jsx";
import Auditoria from "./components/Auditoria.jsx";
import ReajusteSalarial from "./components/ReajusteSalarial.jsx";
import CardsMediaSalarial from "./components/CardsMediaSalarial.jsx";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/global-variable.js";


const App = () => {

  async function buscarFuncionarios(params) {
    const res = await fetch(baseUrl);
    const data = await res.json();
    if(!res.ok){
      throw new Error(data.error);
    }
    return data;
  }

  const {isPending, isError, data, error} = useQuery({
    queryKey: ["funcionarios"],
    queryFn: buscarFuncionarios
  })

  if(isPending) return "Carregando...";

  if(isError) return error.message;

  console.log("dados do postgre db: ", data);
  

  return (
    <>

      <div className="min-h-screen flex flex-col items-center justify-start">
        <div className="w-full max-w-5xl">
          <h1 className="title">
            Gerenciamento de RH
          </h1>
          <InputFuncionario>
            <button className="btn btn-primary">
                Adicionar Funcionário
            </button>
          </InputFuncionario>
          <Auditoria>
            <button className="btn btn-primary ml-4">
                Ver Auditoria
            </button>
          </Auditoria>

          <ReajusteSalarial>
              <button className="btn btn-primary ml-4">
                  Reajustar Salários
              </button>
          </ReajusteSalarial>

          <h2 className="text-2xl font-bold mt-4">Média salarial por cargo</h2>

          <CardsMediaSalarial />

          <TabelaFuncionarios data={data} />
        </div>
      </div>
    </>
  );
};

export default App;
