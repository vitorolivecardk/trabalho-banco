let clienteLogado = JSON.parse(localStorage.getItem('cliente'));

if (!clienteLogado) {
    console.warn("⚠️ Login não encontrado. Usando usuário de teste automático.");
    clienteLogado = {
        id: 1, 
        nome: "João Silva (Modo Teste)",
        cpf: "111.111.111-11"
    };
    localStorage.setItem('cliente', JSON.stringify(clienteLogado));
}

const spanCliente = document.getElementById('nomeCliente');
if (spanCliente) spanCliente.innerText = clienteLogado.nome;


const API_URL = 'http://localhost:8888/api';

async function carregarContas() {
    try {
        const resposta = await fetch(`${API_URL}/contas/cliente/${clienteLogado.id}`);
        const contas = await resposta.json();

        const tbody = document.querySelector('#tabelaContas tbody');
        if (tbody) {
            tbody.innerHTML = '';
            contas.forEach(conta => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${conta.numero}</td>
                    <td>R$ ${conta.saldo.toFixed(2)}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar contas:', erro);
    }
}

async function criarConta() {
    const iniciais = clienteLogado.nome.substring(0, 2).toUpperCase();
    let numeroAleatorio = Math.floor(Math.random() * 999999);
    let numeroFormatado = numeroAleatorio.toString().padStart(6, '0');
    const numeroConta = `${iniciais}-${numeroFormatado}`;

    try {
        const check = await fetch(`${API_URL}/contas/exists?numero=${numeroConta}`);
        const existe = await check.json();

        if (existe) return criarConta(); 

        const novaConta = {
            numero: numeroConta,
            saldo: 0,
            idCliente: clienteLogado.id
        };

        const resposta = await fetch(`${API_URL}/contas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaConta)
        });

        if (resposta.ok) {
            alert(`Conta ${numeroConta} criada com sucesso!`);
            carregarContas();
        } else {
            alert('Erro ao criar conta.');
        }
    } catch (erro) {
        console.error(erro);
        alert('Erro de conexão ou servidor offline.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarContas();

    const btnCriar = document.getElementById('btnCriarConta');
    if (btnCriar) {
        btnCriar.addEventListener('click', criarConta);
    }
});