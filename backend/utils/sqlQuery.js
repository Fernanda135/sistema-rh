// Criar tabela de funcionários
export const criarTabelaFuncionariosQuery = `
    CREATE TABLE funcionarios(
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        idade SMALLINT NOT NULL,
        cargo VARCHAR(50) NOT NULL DEFAULT 'Intern',
        salario DECIMAL(8,2) NOT NULL
    );
`;

// Selecionar todos os funcionários
export const todosFuncionariosQuery = `SELECT * FROM funcionarios;`;

// Inserir um novo funcionário
export const criarFuncionarioQuery = `
    INSERT INTO funcionarios (nome, email, idade, cargo, salario)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
`;

// Selecionar um funcionário pelo ID
export const pegarFuncionarioQuery = `
    SELECT * FROM funcionarios WHERE id = $1
`;

// Deletar um funcionário pelo ID
export const deletarFuncionarioQuery = `
    DELETE FROM funcionarios WHERE id = $1
`;

// Atualizar informações de um funcionário
export const atualizarFuncionarioQuery = `
    UPDATE funcionarios
    SET 
        nome = $1,
        email = $2,
        idade = $3,
        cargo = $4,
        salario = $5
    WHERE id = $6
    RETURNING *
`;


// CREATE TABLE auditoria_funcionarios (
//     id SERIAL PRIMARY KEY,
//     funcionario_id INT,
//     operacao VARCHAR(10),
//     dados_antes JSONB,
//     dados_depois JSONB,
//     data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );



// CREATE OR REPLACE FUNCTION fn_auditoria_funcionarios()
// RETURNS TRIGGER AS $$
// BEGIN
//     IF TG_OP = 'INSERT' THEN
//         INSERT INTO auditoria_funcionarios (
//             funcionario_id,
//             operacao,
//             dados_depois
//         )
//         VALUES (
//             NEW.id,
//             'INSERT',
//             row_to_json(NEW)
//         );
//         RETURN NEW;

//     ELSIF TG_OP = 'UPDATE' THEN
//         INSERT INTO auditoria_funcionarios (
//             funcionario_id,
//             operacao,
//             dados_antes,
//             dados_depois
//         )
//         VALUES (
//             NEW.id,
//             'UPDATE',
//             row_to_json(OLD),
//             row_to_json(NEW)
//         );
//         RETURN NEW;

//     ELSIF TG_OP = 'DELETE' THEN
//         INSERT INTO auditoria_funcionarios (
//             funcionario_id,
//             operacao,
//             dados_antes
//         )
//         VALUES (
//             OLD.id,
//             'DELETE',
//             row_to_json(OLD)
//         );
//         RETURN OLD;
//     END IF;
// END;
// $$ LANGUAGE plpgsql;

// CREATE TRIGGER trg_auditoria_funcionarios
// AFTER INSERT OR UPDATE OR DELETE
// ON funcionarios
// FOR EACH ROW
// EXECUTE FUNCTION fn_auditoria_funcionarios();

export const auditoriaFuncionariosQuery = `
    SELECT * FROM auditoria_funcionarios
`;


// CREATE OR REPLACE FUNCTION media_salarial_por_cargo(
//     p_cargo VARCHAR
// )
// RETURNS NUMERIC(10,2) AS $$
// DECLARE
//     media NUMERIC(10,2);
// BEGIN
//     SELECT AVG(salario)
//     INTO media
//     FROM funcionarios
//     WHERE cargo = p_cargo;
//
//     RETURN media;
// END;
// $$ LANGUAGE plpgsql;

export const mediaSalarialPorCargoQuery = `
    SELECT media_salarial_por_cargo($1) AS media
`;



// CREATE OR REPLACE PROCEDURE reajustar_salario_por_cargo(
//     p_cargo VARCHAR,
//     p_percentual NUMERIC
// )
// LANGUAGE plpgsql
// AS $$
// BEGIN
//     UPDATE funcionarios
//     SET salario = salario + (salario * p_percentual / 100)
//     WHERE cargo = p_cargo;
// END;
// $$;


export const reajustarSalarioPorCargoQuery = `
    CALL reajuste_salarial_por_cargo($1, $2)
`;
