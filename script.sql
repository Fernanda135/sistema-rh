-- criação do banco de dados
-- CREATE DATABASE sistema_rh;

-- tabela de funcionários
CREATE TABLE funcionarios(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    idade SMALLINT NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(8,2) NOT NULL
);

-- tabela de auditoria para registrar operações realizadas na tabela funcionarios
CREATE TABLE auditoria_funcionarios (
    id SERIAL PRIMARY KEY,
    funcionario_id INT,
    operacao VARCHAR(10),
    dados_antes JSONB,
    dados_depois JSONB,
    data_operacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- função responsável por registrar as operações na auditoria
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

-- trigger que chama a função de auditoria na tabela funcionarios
CREATE TRIGGER trg_auditoria_funcionarios
AFTER INSERT OR UPDATE OR DELETE
ON funcionarios
FOR EACH ROW
EXECUTE FUNCTION fn_auditoria_funcionarios();

-- função que retorna a média salarial de um cargo específico
CREATE OR REPLACE FUNCTION media_salarial_por_cargo(
    p_cargo VARCHAR
)
RETURNS NUMERIC(10,2) AS $$
DECLARE
    media NUMERIC(10,2);
BEGIN
    SELECT AVG(salario)
    INTO media
    FROM funcionarios
    WHERE cargo = p_cargo;

    RETURN media;
END;
$$ LANGUAGE plpgsql;

-- procedure responsável por aplicar reajuste salarial por cargo
CREATE OR REPLACE PROCEDURE reajustar_salario_por_cargo(
    p_cargo VARCHAR,
    p_percentual NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE funcionarios
    SET salario = salario + (salario * p_percentual / 100)
    WHERE cargo = p_cargo;
END;
$$;