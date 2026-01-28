-- Banco de Dados: sistema_rh
-- CREATE DATABASE sistema_rh;

-- Tabela: Departamentos
CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela: Funcionários
CREATE TABLE funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    idade SMALLINT NOT NULL,
    salario DECIMAL(8,2) NOT NULL,
    departamento_id INT NOT NULL REFERENCES departamentos(id)
);

-- Tabela: Auditoria de Funcionários
CREATE TABLE auditoria_funcionarios (
    id SERIAL PRIMARY KEY,
    funcionario_id INT,
    operacao VARCHAR(10),
    dados_antes JSONB,
    dados_depois JSONB,
    data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Função: Auditoria de Funcionários
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

-- Trigger que chama a função de auditoria na tabela funcionarios
CREATE TRIGGER trg_auditoria_funcionarios
AFTER INSERT OR UPDATE OR DELETE
ON funcionarios
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria_funcionarios();

-- Função: Média Salarial por Departamento
CREATE OR REPLACE FUNCTION media_salarial_dpt(
    p_departamento_id INT
)
RETURNS NUMERIC(10,2) AS $$
DECLARE
    media NUMERIC(10,2);
BEGIN
    SELECT AVG(salario)
    INTO media
    FROM funcionarios
    WHERE departamento_id = p_departamento_id;

    RETURN media;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Reajuste Salarial por Departamento
CREATE OR REPLACE PROCEDURE reajustar_salario_dpt(
    p_departamento_id INT,
    p_percentual NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE funcionarios
    SET salario = salario + (salario * p_percentual / 100)
    WHERE departamento_id = p_departamento_id;
END;
$$;

DELETE FROM funcionarios
WHERE id = 1;

