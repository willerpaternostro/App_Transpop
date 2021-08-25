export function alterarDeputados(state,dados){
    state.deputados = dados
}

export function alterarProposicoes(state,dados){
    state.proposicoesDetalhadas = [];
    state.proposicoes = dados;
    
    //this.dispatch('dadosAbertos/requisitarDetalhesProposicao',dados)
}

export function alterarProposicoesDetalhadas(state,dados){
    state.proposicoesDetalhadas.push(dados)
}

export function adicionarProximosDeputados(state,dados){
    dados.forEach((element) => {
        state.deputados.push(element)
    })
}

export function alterarBotaoCarregarMais(state,dados){
    state.botaoCarregarMais = dados
}

// ALTERAÇÃO DE DIALOGS INFORMATIVOS
export function alterarDialogInformativoVotacao(state,dados){
    state.mostrarDialogInformativoVotacao = dados;
}
