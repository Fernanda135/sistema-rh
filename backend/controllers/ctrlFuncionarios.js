import { query } from "../utils/connectDB.js";
import {
    criarTabelaFuncionariosQuery,
    todosFuncionariosQuery,
    criarFuncionarioQuery,
    pegarFuncionarioQuery,
    deletarFuncionarioQuery,
    atualizarFuncionarioQuery,
    auditoriaFuncionariosQuery,
    mediaSalarialPorCargoQuery,
    reajustarSalarioPorCargoQuery
} from "../utils/sqlQuery.js";
import { createError } from "../utils/error.js";

export async function listarFuncionarios(req, res, next) {
    try {
        // Verifica se a tabela existe
        const response = await query(`SELECT to_regclass('public.funcionarios');`);

        if (!response.rows[0].to_regclass) {
            await query(criarTabelaFuncionariosQuery);
        }

        const result = await query(todosFuncionariosQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        next(createError(400, "Não foi possível obter os funcionários"));
    }
}

export async function criarFuncionario(req, res, next) {
    try {
        const { nome, email, idade, cargo, salario } = req.body;

        if (!nome || !email || !idade || !salario) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        const result = await query(criarFuncionarioQuery, [
            nome,
            email,
            idade,
            cargo || "Intern", // valor padrão se não passar cargo
            salario,
        ]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}

export async function pegarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const result = await query(pegarFuncionarioQuery, [id]);

        if (!result.rows.length) {
            return next(createError(404, "Funcionário não encontrado"));
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}

export async function deletarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const result = await query(deletarFuncionarioQuery, [id]);

        if (result.rowCount === 0) {
            return next(createError(404, "Funcionário não encontrado"));
        }

        res.status(200).json({ message: "Funcionário deletado com sucesso" });
    } catch (error) {
        next(createError(400, error.message));
    }
}

export async function atualizarFuncionario(req, res, next) {
    try {
        const { id } = req.params;
        const { nome, email, idade, cargo, salario } = req.body;

        const result = await query(atualizarFuncionarioQuery, [
            nome,
            email,
            idade,
            cargo,
            salario,
            id,
        ]);

        if (result.rowCount === 0) {
            return next(createError(404, "Funcionário não encontrado"));
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        next(createError(400, error.message));
    }
}




export async function listarAuditoria(req, res, next) {
    try {
        const result = await query(auditoriaFuncionariosQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        next(createError(400, "Erro ao buscar auditoria"));
    }
}



export async function mediaSalarialPorCargo(req, res, next) {
    try {
        const { cargo } = req.params;

        const result = await query(mediaSalarialPorCargoQuery, [cargo]);

        res.status(200).json({
            media: result.rows[0].media ?? 0
        });
    } catch (error) {
        next(createError(400, "Erro ao buscar média salarial"));
    }
}




export async function reajustarSalarioPorCargo(req, res, next) {
    try {
        const { cargo, percentual } = req.body;

        if (!cargo || !percentual) {
            return next(createError(400, "Cargo e percentual são obrigatórios"));
        }

        await query(reajustarSalarioPorCargoQuery, [
            cargo,
            Number(percentual)
        ]);

        res.status(200).json({ message: "Reajuste aplicado com sucesso" });
    } catch (error) {
        console.error(error);
        next(createError(400, "Erro ao reajustar salários"));
    }
}
