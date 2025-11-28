const clienteLogado = JSON.parse(localStorage.getItem('cliente'));

if (!clienteLogado) {
    window.location.href = 'index.html';
} else {
    document.getElementById('nomeCliente').innerText = clienteLogado.nome;
}

const API_URL = 'http://localhost:8888/api';

async function carregarContas() {
    try {
        const resposta = await fetch(`${API_URL}/contas/cliente/${clienteLogado.id}`);
        const contas = await resposta.json();

        const select = document.getElementById('selectConta');
        select.innerHTML = '<option value="" selected disabled>Selecione uma conta</option>';

        contas.forEach(conta => {
            const option = document.createElement('option');
            option.value = conta.id;
            option.innerText = `${conta.numero}`;
            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar contas.");
    }
}

async function consultarExtrato() {
    const idConta = document.getElementById('selectConta').value;
    
    if (!idConta) {
        return alert("Por favor, selecione uma conta.");
    }

    try {
        const resposta = await fetch(`${API_URL}/lancamentos/conta/${idConta}`);
        
        if(resposta.status === 404) {
             document.querySelector('#tabelaExtrato tbody').innerHTML = '<tr><td colspan="3" class="text-center">Nenhum lançamento encontrado.</td></tr>';
             return;
        }

        const lancamentos = await resposta.json();
        const tbody = document.querySelector('#tabelaExtrato tbody');
        tbody.innerHTML = '';

        lancamentos.forEach(lanc => {
            const tr = document.createElement('tr');
            
            const dataHoje = new Date().toLocaleDateString('pt-BR');

            const estilo = lanc.tipo === 'DEPOSITO' ? 'text-success' : 'text-danger';
            const sinal = lanc.tipo === 'DEPOSITO' ? '+' : '-';

            tr.innerHTML = `
                <td>${dataHoje}</td>
                <td class="${estilo} fw-bold">${sinal} R$ ${lanc.valor.toFixed(2)}</td>
                <td>${lanc.tipo}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar extrato.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarContas();
    
    const btn = document.getElementById('btnConsultar');
    if (btn) btn.addEventListener('click', consultarExtrato);
});