# 🏦 OBank - Sistema Bancário (Front-end)

Este repositório contém a resolução do Exercício Avaliativo II da disciplina de Desenvolvimento de Sistemas. O projeto consiste na implementação do Front-end (HTML, CSS e JavaScript) para consumir uma API bancária.

## 📋 Funcionalidades Implementadas
- **Login:** Autenticação de usuários cadastrados.
- **Contas (RF-04):** Listagem e criação de novas contas.
- **Operações (RF-05):** Realização de Saques e Depósitos com validação de saldo.
- **Extrato (RF-06):** Visualização do histórico de transações.

## ⚠️ AVISO IMPORTANTE SOBRE A API

Devido à instabilidade do servidor AWS original (`54.233.183.126`), este projeto foi configurado para rodar com a **API localmente**.

Para testar o projeto corretamente:
1. É necessário ter o servidor **Spring Boot** (Backend) rodando na máquina local na porta `8888`.
2. O Front-end está apontando para `http://localhost:8888/api`.

