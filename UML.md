# Diagrama de Casos de Uso – UML

```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart LR
    RH[Administrador / RH]

    UC1[Listar Funcionários]
    UC2[Criar Funcionário]
    UC3[Atualizar Funcionário]
    UC4[Deletar Funcionário]
    UC5[Consultar Auditoria]
    UC6[Ver Média Salarial por Cargo]
    UC7[Reajustar Salário por Cargo]

    RH --> UC1
    RH --> UC2
    RH --> UC3
    RH --> UC4
    RH --> UC5
    RH --> UC6
    RH --> UC7
