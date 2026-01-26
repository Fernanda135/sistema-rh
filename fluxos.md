# Fluxos do Sistema RH

## Listar Funcionários

```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário faz requisição GET]
    B[API recebe requisição]
    C[Verifica se tabela existe]
    D{Tabela existe?}
    E[Cria tabela funcionarios]
    F[Busca todos os funcionários]
    G[Retorna lista de funcionários]

    A --> B --> C --> D
    D -- Não --> E --> F --> G
    D -- Sim --> F --> G
```
## Criar Funcionário
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário envia dados]
    B[API valida campos]
    C{Dados válidos?}
    D[Retorna erro 400]
    E[Insere funcionário no banco]
    F[Trigger é acionada]
    G[Auditoria registra INSERT]
    H[Retorna funcionário criado]

    A --> B --> C
    C -- Não --> D
    C -- Sim --> E --> F --> G --> H
```

## Atualizar Funcionário
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário envia ID e os dados]
    B[API recebe requisição]
    C[Atualiza funcionário no banco]
    D{Funcionário existe?}
    E[Retorna erro 404]
    F[Trigger é acionada]
    G[Auditoria registra UPDATE]
    H[Retorna dados atualizados]

    A --> B --> C --> D
    D -- Não --> E
    D -- Sim --> F --> G --> H
```

## Deletar Funcionário
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário envia ID]
    B[API recebe requisição]
    C[Remove funcionário do banco]
    D{Funcionário existe?}
    E[Retorna erro 404]
    F[Trigger é acionada]
    G[Auditoria registra DELETE]
    H[Retorna confirmação]

    A --> B --> C --> D
    D -- Não --> E
    D -- Sim --> F --> G --> H
```

## Consulta de Auditoria
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário solicita auditoria]
    B[API recebe requisição]
    C[Consulta tabela auditoria_funcionarios]
    D[Retorna registros de auditoria]

    A --> B --> C --> D
```

## Média Salarial por Cargo
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário informa cargo]
    B[API recebe requisição]
    C[Executa FUNCTION no banco]
    D[Calcula média salarial]
    E[Retorna valor da média]

    A --> B --> C --> D --> E
```

## Reajuste Salarial por Cargo
```mermaid
%%{init: {"theme":"neutral"}}%%
flowchart TD
    A[Usuário informa cargo e %]
    B[API valida dados]
    C{Dados válidos?}
    D[Retorna erro 400]
    E[Executa PROCEDURE no banco]
    F[Atualiza salários]
    G[Trigger registra UPDATE]
    H[Retorna confirmação]

    A --> B --> C
    C -- Não --> D
    C -- Sim --> E --> F --> G --> H
```