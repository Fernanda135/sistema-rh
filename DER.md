# Diagrama Entidade–Relacionamento (DER)

```mermaid
%%{init: {"theme":"neutral"}}%%
erDiagram
    FUNCIONARIOS {
        int id PK
        varchar nome
        varchar email
        smallint idade
        varchar cargo
        decimal salario
    }

    AUDITORIA_FUNCIONARIOS {
        int id PK
        int funcionario_id FK
        varchar operacao
        jsonb dados_antes
        jsonb dados_depois
        timestamp data_operacao
    }

    FUNCIONARIOS ||--o{ AUDITORIA_FUNCIONARIOS : "1:N"
