let origTab;
const hum = 'O';
const comp = 'X';
const combVenc = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
iniciarJogo();

function iniciarJogo() {
    document.querySelector('.fimDeJogo').style.display = 'none';
    origTab = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(celula) {
    if (typeof origTab[celula.target.id] == 'number') {
        turn(celula.target.id, hum);
        if (!verificaVencedor(origTab, hum) && !verificaEmpate()) turn(bestSpot(), comp);
    }
}

function turn(celulaId, jogador) {
    origTab[celulaId] = jogador;
    document.getElementById(celulaId).innerText = jogador;
    let gameWon = verificaVencedor(origTab, jogador);
    if (gameWon) fimDeJogo(gameWon);
}

function verificaVencedor(tab, jogador) {
    let plays = tab.reduce((a, e, i) => (e === jogador) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of combVenc.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {
                index: index,
                jogador: jogador
            };
            break;
        }
    }
    return gameWon;
}

function fimDeJogo(gameWon) {
    for (let index of combVenc[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.jogador === hum ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declaraVencedor(gameWon.jogador === hum ? "Você venceu!" : "Você perdeu!");
}

function declaraVencedor(ganhador) {
    document.querySelector('.fimDeJogo').style.display = 'block';
    document.querySelector('.fimDeJogo .text').innerText = ganhador;
}

function celulasVazias() {
    return origTab.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origTab, comp).index;
}

function verificaEmpate() {
    if (celulasVazias().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declaraVencedor('Deu velha!')
        return true;
    }
    return false;
}

function minimax(novoTab, jogador) {
    let availSpots = celulasVazias();

    if (verificaVencedor(novoTab, hum)) {
        return {
            pontuacao: -1
        };
    } else if (verificaVencedor(novoTab, comp)) {
        return {
            pontuacao: 1
        };
    } else if (availSpots.length === 0) {
        return {
            pontuacao: 0
        };
    }
    let movimentos = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = novoTab[availSpots[i]];
        novoTab[availSpots[i]] = jogador;

        if (jogador == comp) {
            let resultado = minimax(novoTab, hum);
            move.pontuacao = resultado.pontuacao;
        } else {
            let resultado = minimax(novoTab, comp);
            move.pontuacao = resultado.pontuacao;
        }

        novoTab[availSpots[i]] = move.index;

        movimentos.push(move);
    }

    let melhorMovimento;
    if (jogador === comp) {
        let melhorPontuacao = -10000;
        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].pontuacao > melhorPontuacao) {
                melhorPontuacao = movimentos[i].pontuacao;
                melhorMovimento = i;
            }
        }
    } else {
        let melhorPontuacao = 10000;
        for (let i = 0; i < movimentos.length; i++) {
            if (movimentos[i].pontuacao < melhorPontuacao) {
                melhorPontuacao = movimentos[i].pontuacao;
                melhorMovimento = i;
            }
        }
    }
    
    return movimentos[melhorMovimento];
}