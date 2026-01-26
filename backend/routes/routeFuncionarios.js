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

// Listar a tabela auditoria
rotas.get("/auditoria", listarAuditoria)

// function
rotas.get("/media/:cargo", mediaSalarialPorCargo);

// procedure
rotas.post("/reajuste", reajustarSalarioPorCargo);

// Obter todos os funcionários
rotas.get("/", listarFuncionarios);

// Criar um novo funcionário
rotas.post("/", criarFuncionario);

// Obter um funcionário pelo ID
rotas.get("/:id", pegarFuncionario);

// Deletar um funcionário pelo ID
rotas.delete("/:id", deletarFuncionario);

// Atualizar um funcionário pelo ID
rotas.put("/:id", atualizarFuncionario);

export default rotas;
