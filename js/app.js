let qtdTarefas = 0; 

function montaTarefa(id, descricao, status) {
    return {
        id: id,
        descricao: descricao,
        status: status
    };
}

function adicionaTarefaNaLista() {
    const novaTarefa = document.getElementById('input_nova_tarefa').value;

    if (novaTarefa.trim() !== '') {
        criaNovoItemDaLista(novaTarefa);
        document.getElementById('input_nova_tarefa').value = '';
        const tarefa = montaTarefa(`tarefa_id_${qtdTarefas}`, novaTarefa, 'aberta');
        adicionaTarefaAListaLocalStorage(tarefa);
        qtdTarefas++; // Atualiza a quantidade de tarefas
    } else {
        alert("É necessário digitar a tarefa");
    }
}


function criaNovoItemDaLista(textoDaTarefa, status = 'aberta') {
    const listaTarefas = document.getElementById('lista_de_tarefas');

    const novoItem = document.createElement('li');
    novoItem.innerText = textoDaTarefa;
    novoItem.id = `tarefa_id_${qtdTarefas}`;
    novoItem.appendChild(criaInputCheckBoxTarefa(novoItem.id, status));
    novoItem.appendChild(criaBotaoEdicao(novoItem.firstChild)); // Passando apenas o texto da tarefa para criaBotaoEdicao

    listaTarefas.appendChild(novoItem);
}


function criaBotaoEdicao(textoTarefa) {
    const botaoEdicao = document.createElement('button');
    botaoEdicao.innerText = 'Editar';
    botaoEdicao.className = 'botao-edicao';
    botaoEdicao.addEventListener('click', () => habilitaEdicao(textoTarefa));
    return botaoEdicao;
}


function habilitaEdicao(textoTarefa) {
    const novoInput = document.createElement('input');
    novoInput.type = 'text';
    novoInput.value = textoTarefa.textContent;
    novoInput.addEventListener('blur', () => salvaEdicao(textoTarefa, novoInput));
    textoTarefa.replaceWith(novoInput);
}

function salvaEdicao(textoTarefa, novoInput) {
    const novoTexto = novoInput.value;
    const textoItem = document.createElement('span');
    textoItem.textContent = novoTexto;
    novoInput.replaceWith(textoItem);

    mudaEstadoTarefaLocalStorage(textoTarefa.parentElement.id, novoTexto);
}


function criaInputCheckBoxTarefa(idTarefa, status) {
    const inputTarefa = document.createElement('input');
    inputTarefa.type = 'checkbox';
    inputTarefa.checked = status === 'fechada';
    inputTarefa.setAttribute('onclick', `mudaEstadoTarefa('${idTarefa}')`);
    return inputTarefa;
}


function mudaEstadoTarefa(idTarefa) {
    const tarefaSelecionada = document.getElementById(idTarefa);
    if (tarefaSelecionada.style.textDecoration === 'line-through') {
        tarefaSelecionada.style.textDecoration = 'none';
    } else {
        tarefaSelecionada.style.textDecoration = 'line-through';
    }
    mudaEstadoTarefaLocalStorage(idTarefa);
}


function ocultarTarefasConcluidas() {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    const tarefas = listaTarefas.querySelectorAll('li');

    tarefas.forEach(tarefa => {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            tarefa.style.display = 'none';
        }
    });

    atualizaEstadoTarefasLocalStorage();
}


function atualizaEstadoTarefasLocalStorage() {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    const tarefas = listaTarefas.querySelectorAll('li');
    let listaTarefasLocalStorage = JSON.parse(localStorage.getItem('lista_tarefas') || '[]');

    tarefas.forEach(tarefa => {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        listaTarefasLocalStorage.forEach(item => {
            if (item.id === tarefa.id) {
                item.status = checkbox.checked ? 'fechada' : 'aberta';
            }
        });
    });

    localStorage.setItem('lista_tarefas', JSON.stringify(listaTarefasLocalStorage));
}


function validaSeExisteTarefasNoLocalStorageEMostraNaTela() {
    const listaTarefasLocalStorage = JSON.parse(localStorage.getItem('lista_tarefas') || '[]');
    
    listaTarefasLocalStorage.forEach(tarefa => {
        criaNovoItemDaLista(tarefa.descricao, tarefa.status);
    });

    ocultarTarefasConcluidasAoCarregar();
}


function ocultarTarefasConcluidasAoCarregar() {
    const listaTarefas = document.getElementById('lista_de_tarefas');
    const tarefas = listaTarefas.querySelectorAll('li');

    tarefas.forEach(tarefa => {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            tarefa.style.display = 'none';
        }
    });
}


function adicionaTarefaAListaLocalStorage(tarefa) {
    let listaTarefas = JSON.parse(localStorage.getItem('lista_tarefas') || '[]');

    listaTarefas.push(tarefa);
    localStorage.setItem('lista_tarefas', JSON.stringify(listaTarefas));
}


function mudaEstadoTarefaLocalStorage(idTarefa, novoTexto = null) {
    let listaTarefas = JSON.parse(localStorage.getItem('lista_tarefas') || '[]');

    listaTarefas.forEach(tarefa => {
        if (tarefa.id === idTarefa) {
            tarefa.status = (tarefa.status === 'aberta') ? 'fechada' : 'aberta';
            if (novoTexto) {
                tarefa.descricao = novoTexto;
            }
        }
    });

    localStorage.setItem('lista_tarefas', JSON.stringify(listaTarefas));
}

// Carregar tarefas ao carregar a página
validaSeExisteTarefasNoLocalStorageEMostraNaTela();
