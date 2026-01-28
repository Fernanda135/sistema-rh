# Diagrama de Casos de Uso – UML

```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart LR
    ADM[Administrador]

    UC1[Listar Funcionários]
    UC2[Criar Funcionário]
    UC3[Atualizar Funcionário]
    UC4[Deletar Funcionário]
    UC5[Consultar Auditoria]
    UC6[Ver Média Salarial por Cargo]
    UC7[Reajustar Salário por Cargo]

    ADM --> UC1
    ADM --> UC2
    ADM --> UC3
    ADM --> UC4
    ADM --> UC5
    ADM --> UC6
    ADM --> UC7
```