// Departamentos

// Criar tabela de departamentos
export const criarTabelaDepartamentosQuery = `
    CREATE TABLE departamentos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL UNIQUE
    );
`;

// Inserir um novo departamento
export const criarDepartamentoQuery = `
    INSERT INTO departamentos (nome)
    VALUES ($1)
    RETURNING *;
`;

// Selecionar todos os departamentos
export const todosDepartamentosQuery = `
    SELECT * FROM departamentos ORDER BY id;
`;

// Deletar um departamento pelo ID
export const deletarDepartamentoQuery = `
    DELETE FROM departamentos WHERE id = $1
    RETURNING *;
`;

// Contar funcionários por departamento
export const contarFuncionariosPorDepartamentoQuery = `
    SELECT COUNT(*) AS count FROM funcionarios WHERE departamento_id = $1;
`;


// Funcionários

// Criar tabela de funcionários
export const criarTabelaFuncionariosQuery = `
    CREATE TABLE funcionarios(
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        idade SMALLINT NOT NULL,
        salario DECIMAL(8,2) NOT NULL,
        departamento_id INT NOT NULL REFERENCES departamentos(id)
    );
`;

// Selecionar todos os funcionários
export const todosFuncionariosQuery = `
    SELECT * FROM funcionarios ORDER BY id;
`;

// Selecionar todos os funcionários com nome do departamento
export const todosFuncionariosComDepartamentoQuery = `
    SELECT 
        f.id,
        f.nome,
        f.email,
        f.idade,
        f.salario,
        f.departamento_id,
        d.nome AS departamento_nome
    FROM funcionarios f
    LEFT JOIN departamentos d ON f.departamento_id = d.id
    ORDER BY f.id;
`;

// Inserir um novo funcionário
export const criarFuncionarioQuery = `
    INSERT INTO funcionarios (nome, email, idade, salario, departamento_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
`;

// Selecionar um funcionário pelo ID
export const pegarFuncionarioQuery = `
    SELECT * FROM funcionarios WHERE id = $1;
`;

// Atualizar informações de um funcionário
export const atualizarFuncionarioQuery = `
    UPDATE funcionarios
    SET 
        nome = $1,
        email = $2,
        idade = $3,
        salario = $4,
        departamento_id = $5
    WHERE id = $6
    RETURNING *;
`;

// Deletar um funcionário pelo ID
export const deletarFuncionarioQuery = `
    DELETE FROM funcionarios WHERE id = $1;
`;


// Auditoria

// Criar tabela de auditoria de funcionários
export const criarTabelaAuditoriaQuery = `
    CREATE TABLE auditoria_funcionarios (
        id SERIAL PRIMARY KEY,
        funcionario_id INT,
        operacao VARCHAR(10),
        dados_antes JSONB,
        dados_depois JSONB,
        data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Criar trigger de auditoria para a tabela de funcionários
export const criarTriggerAuditQuery = `
    CREATE OR REPLACE FUNCTION fn_auditoria_funcionarios()
    RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO auditoria_funcionarios (
                funcionario_id,
                operacao,
                dados_depois
            )
            VALUES (
                NEW.id,
                'INSERT',
                row_to_json(NEW)
            );
            RETURN NEW;

        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO auditoria_funcionarios (
                funcionario_id,
                operacao,
                dados_antes,
                dados_depois
            )
            VALUES (
                NEW.id,
                'UPDATE',
                row_to_json(OLD),
                row_to_json(NEW)
            );
            RETURN NEW;

        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO auditoria_funcionarios (
                funcionario_id,
                operacao,
                dados_antes
            )
            VALUES (
                OLD.id,
                'DELETE',
                row_to_json(OLD)
            );
            RETURN OLD;
        END IF;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_auditoria_funcionarios
    AFTER INSERT OR UPDATE OR DELETE
    ON funcionarios
    FOR EACH ROW
    EXECUTE FUNCTION fn_auditoria_funcionarios();
`;

// Selecionar registros de auditoria
export const auditoriaFuncionariosQuery = `
    SELECT * FROM auditoria_funcionarios;
`;


// Function e Procedure

// Média salarial por departamento
export const mediaSalarialPorDepartamentoQuery = `
    SELECT media_salarial_dpt($1) AS media;
`;

// Reajustar salários por departamento
export const reajustarSalarioPorDepartamentoQuery = `
    CALL reajustar_salario_dpt($1, $2);
`;
