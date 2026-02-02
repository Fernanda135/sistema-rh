import { query } from "../utils/connectDB.js";
import {
  criarTabelaDepartamentosQuery,
  todosDepartamentosQuery,
  criarDepartamentoQuery,
  deletarDepartamentoQuery,
  contarFuncionariosPorDepartamentoQuery,
  criarTabelaFuncionariosQuery,
  todosFuncionariosQuery,
  criarFuncionarioQuery,
  pegarFuncionarioQuery,
  deletarFuncionarioQuery,
  atualizarFuncionarioQuery,
  todosFuncionariosComDepartamentoQuery,
  criarTabelaAuditoriaQuery,
  criarTriggerAuditQuery,
  auditoriaFuncionariosQuery,
  mediaSalarialPorDepartamentoQuery,
  reajustarSalarioPorDepartamentoQuery,
} from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";


// Listar funcionários com o nome do departamento
export async function listarFuncionariosComDepartamento(req, res, next) {
    try {
        const result = await query(todosFuncionariosComDepartamentoQuery);
        res.status(200).json(result.rows); 
    } catch (error) {
        console.log(error);
        res.status(400).json({ erro: "Não foi possível listar os funcionários com departamentos" });
    }
}


// Listar todos os departamentos
export async function listarDepartamentos(req, res, next) {
    try {
        const response = await query(`SELECT to_regclass('public.departamentos');`);
        if (!response.rows[0].to_regclass) await query(criarTabelaDepartamentosQuery);

        const result = await query(todosDepartamentosQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        next(createError(400, "Não foi possível obter os departamentos"));
    }
}


// Criar um novo departamento
export async function criarDepartamento(req, res, next) {
    try {
        const { nome } = req.body;
        if (!nome) return next(createError(400, "O nome do departamento é obrigatório"));

        const result = await query(criarDepartamentoQuery, [nome]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Deletar departamento
export async function deletarDepartamento(req, res, next) {
    try {
      const { id } = req.params;

      // Verificar se há funcionários no departamento
      const countResult = await query(contarFuncionariosPorDepartamentoQuery, [
        id,
      ]);
      const employeeCount = parseInt(countResult.rows[0].count);
      if (employeeCount > 0) {
        return next(
          createError(
            400,
            "Não é possível deletar um departamento que possui funcionários",
          ),
        );
      }

      const result = await query(deletarDepartamentoQuery, [id]);
      if (result.rowCount === 0)
        return next(createError(404, "Departamento não encontrado"));

      res.status(200).json({ message: "Departamento deletado com sucesso" });
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Criar funcionário
export async function criarFuncionario(req, res, next) {
    try {
        const { nome, email, idade, salario, departamento_id } = req.body;
        if (!nome || !email || !idade || !salario || !departamento_id) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        const result = await query(criarFuncionarioQuery, [
            nome,
            email,
            idade,
            salario,
            departamento_id
        ]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Pegar funcionário por ID
export async function pegarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const result = await query(pegarFuncionarioQuery, [id]);

        if (!result.rows.length) return next(createError(404, "Funcionário não encontrado"));
        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Listar todos os funcionários
export async function listarFuncionarios(req, res, next) {
    try {
        const response = await query(`SELECT to_regclass('public.funcionarios');`);

        if (!response.rows[0].to_regclass) {
            await query(criarTabelaDepartamentosQuery);
            await query(criarTabelaFuncionariosQuery);
            await query(criarTabelaAuditoriaQuery);
            await query(criarTriggerAuditQuery);
        }

        const result = await query(todosFuncionariosQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        next(createError(400, "Não foi possível listar os funcionários"));
    }
}


// Deletar funcionário
export async function deletarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const result = await query(deletarFuncionarioQuery, [id]);
        if (result.rowCount === 0) return next(createError(404, "Funcionário não encontrado"));

        res.status(200).json({ message: "Funcionário deletado com sucesso" });
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Atualizar funcionário
export async function atualizarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const { nome, email, idade, salario, departamento_id } = req.body;

        const result = await query(atualizarFuncionarioQuery, [
            nome,
            email,
            idade,
            salario,
            departamento_id,
            id
        ]);

        if (result.rowCount === 0) return next(createError(404, "Funcionário não encontrado"));
        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}


// Listar auditoria de funcionários
export async function listarAuditoria(req, res, next) {
    try {
        const result = await query(auditoriaFuncionariosQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        next(createError(400, "Erro ao buscar auditoria"));
    }
}


// Média salarial por departamento
export async function mediaSalarialPorDepartamento(req, res, next) {
    try {
        const { departamento_id } = req.params;
        const result = await query(mediaSalarialPorDepartamentoQuery, [departamento_id]);

        res.status(200).json({ media: result.rows[0].media ?? 0 });
    } catch (error) {
        next(createError(400, "Erro ao buscar média salarial"));
    }
}


// Reajustar salário por departamento
export async function reajustarSalarioPorDepartamento(req, res, next) {
    try {
        const { departamento_id, percentual } = req.body;
        if (!departamento_id || !percentual) {
            return next(createError(400, "Departamento e percentual são obrigatórios"));
        }

        await query(reajustarSalarioPorDepartamentoQuery, [
            departamento_id,
            Number(percentual)
        ]);
        res.status(200).json({ message: "Reajuste aplicado com sucesso" });
    } catch (error) {
        console.error(error);
        next(createError(400, "Erro ao reajustar salários"));
    }
}
