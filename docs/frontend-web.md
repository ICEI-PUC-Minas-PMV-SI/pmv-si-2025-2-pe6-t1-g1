# Front-end Web

A aplicação web da FatiaCerta é uma plataforma de gestão interna, desenvolvida para uso exclusivo dos funcionários. O sistema visa otimizar os processos operacionais, centralizando funcionalidades como o gerenciamento de usuários, a administração do cardápio e o monitoramento completo do ciclo de pedidos e seus respectivos status.

## Projeto da Interface Web

[Descreva o projeto da interface Web da aplicação, incluindo o design visual, layout das páginas, interações do usuário e outros aspectos relevantes.]

### Wireframes
<img width="1366" height="768" alt="Login desktop" src="https://github.com/user-attachments/assets/94951727-dc0f-4ef6-a96f-f7f441e6b0c7" />
<img width="1366" height="768" alt="orders" src="https://github.com/user-attachments/assets/99ee2ed7-659b-4f50-aea4-249728b1f5e8" />
<img width="1366" height="768" alt="items" src="https://github.com/user-attachments/assets/b362fdbb-31d0-488b-9fde-bbb4e8686636" />
<img width="1366" height="768" alt="users" src="https://github.com/user-attachments/assets/25b7af2c-b356-4cd6-a459-3d25fe0047f8" />



### Design Visual

A cor predominante na plataforma é o vermelho (#EB3738). Essa tonalidade é amplamente utilizada em serviços de alimentação, pois está associada à comida e pode estimular o apetite. A escolha da fonte Poppins, sem serifa, reforça a proposta de um produto moderno e intuitivo. Já o logotipo faz referência a utensílios comuns de cozinha.

## Fluxo de Dados
### Fluxograma do Processo de Pedido
![Fluxograma do Processo de Pedido](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/blob/main/docs/img/fluxograma_page-0001.jpg)


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


## Pagína de Pedidos

### 1 - Deve ser possível visualizar todos os Pedidos ao acessar a tela 

<img width="1544" height="929" alt="image" src="https://raw.githubusercontent.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/refs/heads/main/docs/img/3.jpeg" />

### 2 - Deve ser possível filtrar Pedidos de acordo com a etapa de preparo 

<img width="1555" height="922" alt="image" src="https://raw.githubusercontent.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/refs/heads/main/docs/img/2.jpeg" />

### 3 - Caso não exista um Pedido com a etapa selecionada, uma mensagem informativa deve ser renderizada na tela

<img width="1555" height="922" alt="image" src="https://raw.githubusercontent.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/refs/heads/main/docs/img/1.jpeg" />


## Página de cardápio

### 1 - Deve ser possível visualizar todos os items ao acessar a tela
<img width="1912" height="909" alt="image" src="https://github.com/user-attachments/assets/541a1035-f23f-4a58-a0e9-1a1a0f48c65b" />

### 2 - Deve ser possível filtrar todos os items de acordo com sua categoria
<img width="1915" height="911" alt="image" src="https://github.com/user-attachments/assets/c30e7983-3d18-4886-a13a-f6b775d98402" />

## Tela Cadastro de Usuários

### Cenário 
Cadastrar usuário com dados válidos

### Passos

1. Preencha todos os campos (nome, e-mail, telefone, senha, confirmar senha) com dados válidos.
2. Clique em “Cadastrar”.

### Resultado esperado

Exibe mensagem de sucesso (“Usuário cadastrado com sucesso”).

<img width="600" height="500" alt="Cadastro" src="https://github.com/user-attachments/assets/ef0e5bff-61fd-4b87-8ed2-ce5fc73cccc1" />

### 2 - Campo obrigatório vazio

<img width="600" height="500" alt="obrigatorio" src="https://github.com/user-attachments/assets/61a00393-0419-4b7e-8bf3-96fdeaaad472" />

### 3 - E-mail já cadastrado

<img width="600" height="500" alt="email ja cadastrado" src="https://github.com/user-attachments/assets/5c4d3fcd-5d46-4e34-85ad-3d501a0cb1e7" />

## Tela de edição de usuário

### Cenário 
Editar um usuário já criado.

![Edição de usuário](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/blob/main/docs/img/editar%20inicial.png)
### Passos
 Preencher os dados do usuário sendo possível alterar o nome, numero, função e senha restando apenas o Email que não pode ser alterado.

### Resultado esperado

Exibe mensagem de sucesso (“Usuário atualizado com sucesso!”).

![Edição de usuário sucesso](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/blob/main/docs/img/print%20de%20sucesso%20(1).png)

### 2 - Campo obrigatório vazio
Ao deixar um campo obrigatorio vazio o sistema não atualizará

![Edição de usuário erro](https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g1/blob/main/docs/img/preenchimento%20obrigatorio.png)


## Tela de cardápio

### Cenário
Adionar novo item.
<img width="1914" height="912" alt="image" src="https://github.com/user-attachments/assets/a24172a8-bb46-4105-a523-c382a50a8550" />


### Passos
1. Clique no botão "Adicionar novo item"
2. Preencha todos os campos(Nome do item, Descrição, Valor, Categoria) do modal com formulário.
3. Clique em "Salvar".

### Resultado Esperado
O item criado é exibido na tela automaticamente sem exibir mensagens.
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/d964f88d-ac57-43ce-ae67-9e7feeadca5a" />

### Cenário
Editar item criado.
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/2261c2cb-9bb9-4619-a05a-388d97f8e2d6" />

### Passos
1. Clique no botão editar no card do item desejado.
2. Substitua os campos no modal formulário que deseja.
3. Clique em "Atualizar"

### Resultado Esperado
O item após editado será exibido automaticamente na tela sem exibir mensagens.
<img width="786" height="408" alt="image" src="https://github.com/user-attachments/assets/da49f038-e315-4956-ac53-71108e308225" />

### Cenário
Deletar item criado.
<img width="1918" height="955" alt="image" src="https://github.com/user-attachments/assets/83f22d7f-60b6-4ae5-9b88-ff59912342bd" />

### Passos
1. Clique no botão apagar no card do item desejado.
2. Clique em "Ok" na confirmação exibida no topo da tela.

### Resultado Esperado
Após o item ser excluido será exibida uma mensagem temporária na tela de aviso de exclusão.
<img width="1915" height="908" alt="image" src="https://github.com/user-attachments/assets/585f5879-5f1a-4952-a011-755fef440fce" />


# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

### Semana 1

Atualizado em: 31/10/2024

| Responsável     | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----           |    :----         |      :----:    | :----:     | :----: | :----:          |
| Vitor Gonçalves | Tela Cadastro de Usuário | 20/10/2025     | 31/10/2025 | ✔️    | 30/10/2025      |
| Samuel Lacerda  | Tela login       | 20/10/2025     | 31/10/2025 | ✔️    |   31/10/2025              |
| Bruno Tetzner   | Figma            | 20/10/2025     | 25/10/2025 | ✔️   |  25/10/2025               |
| Pedro Justino   | fluxograma       | 20/10/2025     | 29/10/2025 | ✔️    | 29/10/2025  |
| Luigi Mezzogori   | Tela Pedidos       | 20/10/2025     | 28/10/2025 | ✔️    | 30/10/2025  |
| Victor Alexandre   | Tela Cardápio       | 20/10/2025     | 28/10/2025 | ✔️    | 26/10/2025  |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Vitor Gonçalves        | Testes Tela Cadastro   | 27/10/2025     | 31/10/2025 | ✔️    | 30/10/2025      |
| Bruno Tetzner       | Listagem de usuários  |    25/10/2025        | 31/10/2025 | ✔️   | 31/10/2025      |
| Bruno Tetzner       | Documentação do layout e considerações de segurança  |    25/10/2025        | 31/10/2025 | ✔️   | 31/10/2025      |
| Samuel Lacerda        | Testes tela login    | 28/10/2025    | 31/10/2025 | ✔️    | 31/10/2025                |
|Pedro Justino | Tela e testes de edição de usuário| 26/10/2025 | 31/10/2025 |✔️| 13/11/2025 |
|Luigi Mezzogori | Aprimorações tela de pedido| 27/10/2025 | 31/10/2025 |✔️| 31/10/2025      |
|Victor Alexandre | Aprimorações tela de cardápio| 28/10/2025 | 28/10/2025 |✔️| 26/10/2025      |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

