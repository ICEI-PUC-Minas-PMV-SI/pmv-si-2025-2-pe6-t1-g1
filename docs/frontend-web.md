# Front-end Web

[Inclua uma breve descrição do projeto e seus objetivos.]

## Projeto da Interface Web

[Descreva o projeto da interface Web da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes
<img width="1366" height="768" alt="Login desktop" src="https://github.com/user-attachments/assets/94951727-dc0f-4ef6-a96f-f7f441e6b0c7" />
<img width="1366" height="768" alt="orders" src="https://github.com/user-attachments/assets/99ee2ed7-659b-4f50-aea4-249728b1f5e8" />
<img width="1366" height="768" alt="items" src="https://github.com/user-attachments/assets/b362fdbb-31d0-488b-9fde-bbb4e8686636" />
<img width="1366" height="768" alt="users" src="https://github.com/user-attachments/assets/25b7af2c-b356-4cd6-a459-3d25fe0047f8" />



### Design Visual

[Descreva o estilo visual da interface, incluindo paleta de cores, tipografia, ícones e outros elementos gráficos.]
A cor predominante na plataforma é o vermelho (#EB3738). Essa tonalidade é amplamente utilizada em serviços de alimentação, pois está associada à comida e pode estimular o apetite. A escolha da fonte Poppins, sem serifa, reforça a proposta de um produto moderno e intuitivo. Já o logotipo faz referência a utensílios comuns de cozinha.

## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]

## Tecnologias Utilizadas
- HTML 5
- CSS 3
- JavaScript

## Considerações de Segurança

Visando fornecer segurança para os usuários,foi implementado um login consumindo uma API que gera um JWT token, que é persistido no localstorage para permitir a navegação do usuário.
Outro recurso importante impregeado é um uso de permissões, que fazem com que clientes e colaboradores não tenham acesso a listagem de usuários da plataforma.

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

Para validação do frontend web da aplicação, foram feitos testes manuais do fluxo. Seguem os resultados obtidos

## Pagína de usuários


### 1 - Deve ser possível visualizar todos os usuários ao acessar a tela 
<img width="1544" height="929" alt="image" src="https://github.com/user-attachments/assets/03a1ede8-ac46-4833-9320-17fe75cc53a7" />

### 2 - Deve ser possível filtrar usuários de acordo com sua permissão 
<img width="1555" height="922" alt="image" src="https://github.com/user-attachments/assets/eab09e64-3695-42f2-9b23-83b18b9db3cc" />

### 3 - Caso não exista um usuário com a permissão selecionada, uma mensagem informativa deve ser renderizada na tela
<img width="1555" height="922" alt="image" src="https://github.com/user-attachments/assets/e6200fb0-484e-4d24-9811-d76a5d856cc7" />


## Cadastro de Usuários


### 1 - Cadastrar usuário com dados válidos 
<img width="600" height="500" alt="Cadastro" src="https://github.com/user-attachments/assets/ef0e5bff-61fd-4b87-8ed2-ce5fc73cccc1" />
<img width="1555" height="273" alt="banco" src="https://github.com/user-attachments/assets/89601719-0734-47fe-b262-ab48dd2834ca" />

### 2 - Campo obrigatório vazio

<img width="600" height="500" alt="obrigatorio" src="https://github.com/user-attachments/assets/61a00393-0419-4b7e-8bf3-96fdeaaad472" />

### 3 - E-mail já cadastrado

<img width="600" height="500" alt="email ja cadastrado" src="https://github.com/user-attachments/assets/5c4d3fcd-5d46-4e34-85ad-3d501a0cb1e7" />


1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 31/10/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Vitor Gonçalves        | Tela Cadastro de Usuário | 20/10/2025     | 31/10/2025 | ✔️    | 30/10/2025      |
| Samuel Lacerda        | Tela login    | 20/10/2025     | 31/10/2025 | ✔️    |   31/10/2025              |
| Bruno Tetzner | Figma            | 20/10/2025     | 25/10/2025 | ✔️   |  25/10/2025               |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Vitor Gonçalves        | Testes Tela Cadastro   | 27/10/2025     | 31/10/2025 | ✔️    | 30/10/2025      |
| Bruno Tetzner       | Listagem de usuários  |    25/10/2025        | 31/10/2025 | ✔️   | 25/10/2025      |
| Bruno Tetzner       | Documentação do layout e considerações de segurança  |    25/10/2025        | 31/10/2025 | ✔️   | 25/10/2025      |

| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

