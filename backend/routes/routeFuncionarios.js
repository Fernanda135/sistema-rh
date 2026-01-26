import express from "express";
import { 
    listarFuncionarios, 
    pegarFuncionario, 
    deletarFuncionario, 
    atualizarFuncionario, 
    criarFuncionario, 
    listarAuditoria,
    mediaSalarialPorCargo,
    reajustarSalarioPorCargo
} from "../controllers/ctrlFuncionarios.js";

const rotas = express.Router();

// trigger - listar a tabela auditoria
rotas.get("/auditoria", listarAuditoria)

// function - media salarial por cargo
rotas.get("/media/:cargo", mediaSalarialPorCargo);

// procedure - reajusta o salário por cargo
rotas.post("/reajuste", reajustarSalarioPorCargo);

// obter todos os funcionários
rotas.get("/", listarFuncionarios);

// criar um novo funcionário
rotas.post("/", criarFuncionario);

// obter um funcionário pelo id
rotas.get("/:id", pegarFuncionario);

// deletar um funcionário pelo id
rotas.delete("/:id", deletarFuncionario);

// atualizar um funcionário pelo id
rotas.put("/:id", atualizarFuncionario);

export default rotas;
