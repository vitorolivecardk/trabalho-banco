const clienteLogado = JSON.parse(localStorage.getItem('cliente'));

if (!clienteLogado) {
    window.location.href = 'index.html';
} else {
    document.getElementById('nomeCliente').innerText = clienteLogado.nome;
}

const API_URL = 'http://localhost:8888/api';

async function carregarContasNoSelect() {
    try {
        const resposta = await fetch(`${API_URL}/contas/cliente/${clienteLogado.id}`);
        const contas = await resposta.json();

        const select = document.getElementById('selectConta');
        select.innerHTML = '<option value="" selected disabled>Selecione uma conta</option>';

        contas.forEach(conta => {
            const option = document.createElement('option');
            option.value = conta.id;
            option.innerText = `${conta.numero} (Saldo: R$ ${conta.saldo.toFixed(2)})`;
            option.dataset.saldo = conta.saldo; 
            select.appendChild(option);
        });

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar contas.");
    }
}

async function realizarOperacao() {
    const idConta = document.getElementById('selectConta').value;
    const tipo = document.getElementById('selectTipo').value; 
    const valorInput = document.getElementById('valorOperacao').value;
    const valor = parseFloat(valorInput);

    if (!idConta) return alert("Selecione uma conta!");
    if (!valor || valor <= 0) return alert("Digite um valor válido!");

    if (tipo === 'SAQUE') {
        const optionSelecionada = document.querySelector(`option[value="${idConta}"]`);
        const saldoAtual = parseFloat(optionSelecionada.dataset.saldo);
        
        if (valor > saldoAtual) {
            return alert("Saldo insuficiente para este saque!");
        }
    }

    const lancamento = {
        idConta: parseInt(idConta),
        tipo: tipo,
        valor: valor
    };

    try {
        const resposta = await fetch(`${API_URL}/lancamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lancamento)
        });

        if (resposta.ok) {
            alert("Operação realizada com sucesso!");
            window.location.href = 'menu.html'; 
        } else {
            alert("Erro ao realizar operação. Verifique os dados.");
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão com o banco.");
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarContasNoSelect();
    
    const btn = document.getElementById('btnConfirmar');
    if (btn) btn.addEventListener('click', realizarOperacao);
});