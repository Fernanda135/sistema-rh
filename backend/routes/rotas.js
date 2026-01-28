import express from "express";
import { 
    listarDepartamentos,
    criarDepartamento,
    deletarDepartamento,
    listarFuncionarios,
    listarFuncionariosComDepartamento,
    pegarFuncionario, 
    deletarFuncionario, 
    atualizarFuncionario, 
    criarFuncionario, 
    listarAuditoria,
    mediaSalarialPorDepartamento,
    reajustarSalarioPorDepartamento
} from "../controllers/controls.js";
const rotas = express.Router();

// trigger - listar a tabela auditoria
rotas.get("/auditoria", listarAuditoria);

// função - média salarial por departamento
rotas.get("/media/:departamento_id", mediaSalarialPorDepartamento);

// procedure - reajusta o salário por departamento
rotas.post("/reajuste", reajustarSalarioPorDepartamento);

// Listar todos os departamentos
rotas.get("/departamentos", listarDepartamentos);

// Criar um novo departamento
rotas.post("/departamentos", criarDepartamento);

// Deletar um departamento pelo ID
rotas.delete("/departamentos/:id", deletarDepartamento);

// obter todos os funcionários
rotas.get("/", listarFuncionarios);

// obter todos os funcionários com nome do departamento
rotas.get("/com-departamento", listarFuncionariosComDepartamento);

// criar um novo funcionário
rotas.post("/", criarFuncionario);

// obter um funcionário pelo id
rotas.get("/:id", pegarFuncionario);

// deletar um funcionário pelo id
rotas.delete("/:id", deletarFuncionario);

// atualizar um funcionário pelo id
rotas.put("/:id", atualizarFuncionario);

export default rotas;
