const perguntas = [
    {
        pergunta: "Qual a classe inicial de Examination?",
        alternativas: [
            "Private",
            "Conscript",
            "Sergeant",
            "Corporal"
        ],
        correta: 1
    },

    {
        pergunta: "Qual é a conquista necessária para se tornar um Leader (Líder)?",
        alternativas: [
            "THE_POINTMAN",
            "UNFORTUNATE",
            "HEART_OF_MENLO",
            "VETERAN_OF_PURGATORY"
        ],
        correta: 3
    },

    {
        pergunta: "Qual a arma inicial de Examination?",
        alternativas: [
            "Lock-18",
            "Lock-17",
            "Brigadier(09)F",
            "Nightstalker"
        ],
        correta: 2
    },

    {
        pergunta: "Qual é o primeiro Chefão de Examination que enfrentamos?",
        alternativas: [
            "[SIN]",
            "MIKHAIL",
            "GILBERT",
            "TROY_(CHIMERA)"
        ],
        correta: 2
    },

    {
        pergunta: "De qual Exercito o player faz parte em Examination?",
        alternativas: [
            "RASONIANS",
            "MENLONIANS"
        ],
        correta: 1
    },

    {
        pergunta: "Quem você salva no começo do Sector 2 de Examination?",
        alternativas: [
            "DAVE",
            "MIKHAIL",
            "JOSH",
            "PAUL_ANTEGRES"
        ],
        correta: 2
    },

    {
        pergunta: "Quem é o Chefão do Sector 2 de Examination?",
        alternativas: [
            "SLASHERS",
            "MIKHAIL",
            "DAVE",
            "[SIN]"
        ],
        correta: 1
    },

    {
        pergunta: "Quais são os inimigos do Sector 3 de Examination?",
        alternativas: [
            "RASONIANS",
            "SCIENTISTS",
            "MENLONIANS",
            "ZUMBIS"
        ],
        correta: 0
    },

    {
        pergunta: "Qual é o penúltimo Chefão de Examination do Sector 3 que tem uma animação de combate exclusiva (QTE) com a Classe de Leader (Líder)?",
        alternativas: [
            "DAVE",
            "[SIN]",
            "TOC_BILL",
            "PAUL_ANTEGRES"
        ],
        correta: 1
    },

    {
        pergunta: "Qual é a música tema do último Chefão de Examination do Sector 3?",
        alternativas: [
            "CORPSE_STEEL - BTR - THEME",
            "PRIDE_OF_RASONIA - [SIN] - THEME",
            "::HUNTING_GROUND:: - TROY_(CHIMERA) - THEME",
            "::STAGNANT_WATER:: - D-ZERO - THEME"
        ],
        correta: 0
    }
];


let perguntaAtual = 0;
let pontos = 0;
let respondendo = false;


/* =========================================
   SISTEMA DE TENTATIVAS
========================================= */

let errosNaPergunta = 0;
let mascaraQuebrada = false;


/* =========================================
   SISTEMA DE SANIDADE
========================================= */

const TEMPO_SANIDADE = 10;

/*
 * Cada acerto recupera 40% da sanidade.
 */

const SANIDADE_POR_ACERTO = 0.40;

/*
 * Sanidade máxima:
 * 1 = 100%
 */

const SANIDADE_MAXIMA = 1;

let sanidadeAtual = SANIDADE_MAXIMA;


/*
 * Controle do cronômetro.
 */

let tempoSanidade = null;
let inicioSanidade = null;


/* =========================================
   ELEMENTOS DO HTML
========================================= */

const perguntaElemento =
    document.getElementById("pergunta");

const alternativasElemento =
    document.getElementById("alternativas");

const resultadoElemento =
    document.getElementById("resultado");

const quizContainer =
    document.querySelector(".quiz-container");

const mascaraOverlay =
    document.getElementById("mascara-overlay");

const sanidadeContainer =
    document.getElementById("sanidade-container");

const sanidadeProgresso =
    document.getElementById("sanidade-progresso");


/* =========================================
   MOSTRAR PERGUNTA
========================================= */

function mostrarPergunta() {

    const pergunta = perguntas[perguntaAtual];

    respondendo = true;

    /*
     * Cada nova pergunta recebe
     * duas chances.
     */

    errosNaPergunta = 0;


    /* Animação da pergunta */

    perguntaElemento.classList.remove(
        "nova-pergunta"
    );

    void perguntaElemento.offsetWidth;

    perguntaElemento.classList.add(
        "nova-pergunta"
    );


    perguntaElemento.textContent =
        pergunta.pergunta;


    alternativasElemento.innerHTML = "";


    resultadoElemento.textContent = "";

    resultadoElemento.classList.remove(
        "resultado-aparecer"
    );


    /* =====================================
       CRIA OS BOTÕES
    ===================================== */

    pergunta.alternativas.forEach(
        (alternativa, indice) => {

            const botao =
                document.createElement("button");


            botao.textContent =
                alternativa;


            /* Animação de entrada */

            botao.style.opacity = "0";

            botao.style.transform =
                "translateX(-20px)";


            setTimeout(() => {

                botao.style.transition =
                    "all 0.3s ease";

                botao.style.opacity = "1";

                botao.style.transform =
                    "translateX(0)";

            }, indice * 100);


            botao.onclick = function () {

                verificarResposta(
                    indice,
                    botao
                );

            };


            alternativasElemento.appendChild(
                botao
            );
        }
    );
}


/* =========================================
   VERIFICAR RESPOSTA
========================================= */

function verificarResposta(
    indice,
    botaoClicado
) {

    /*
     * Impede múltiplos cliques.
     */

    if (!respondendo) {
        return;
    }


    respondendo = false;


    const pergunta =
        perguntas[perguntaAtual];


    const botoes =
        alternativasElemento
            .querySelectorAll("button");


    /*
     * Desabilita os botões enquanto
     * a resposta está sendo processada.
     */

    botoes.forEach(botao => {

        botao.disabled = true;

        botao.style.cursor =
            "default";

    });


    /* =====================================
       ACERTO
    ===================================== */

    if (indice === pergunta.correta) {

        pontos++;


        /*
         * Recupera 40% da sanidade.
         */

        recuperarSanidade();


        botaoClicado.classList.add(
            "correct"
        );


        resultadoElemento.textContent =
            "✓ RESPOSTA CORRETA!";


        resultadoElemento.style.color =
            "#8fc46a";


        resultadoElemento.classList.add(
            "resultado-aparecer"
        );


        /*
         * A máscara continua quebrada.
         */

        setTimeout(() => {

            perguntaAtual++;


            if (perguntaAtual < perguntas.length) {

                mostrarPergunta();

            } else {

                finalizarQuiz();

            }

        }, 1200);


        return;
    }


    /* =====================================
       ERRO
    ===================================== */

    errosNaPergunta++;


    botaoClicado.classList.add(
        "wrong"
    );


    resultadoElemento.textContent =
        "✕ RESPOSTA INCORRETA!";


    resultadoElemento.style.color =
        "#d66b6b";


    resultadoElemento.classList.add(
        "resultado-aparecer"
    );


    /* =====================================
       PRIMEIRO ERRO
    ===================================== */

    if (errosNaPergunta === 1) {

        /*
         * A máscara quebra.
         */

        ativarMascara();


        /*
         * O jogador ainda pode tentar
         * novamente a mesma pergunta.
         */

        setTimeout(() => {

            prepararSegundaTentativa();

        }, 1200);


        return;
    }


    /* =====================================
       SEGUNDO ERRO
    ===================================== */

    if (errosNaPergunta >= 2) {

        /*
         * Gilbert mata imediatamente
         * no segundo erro.
         */

        mostrarGilbert();

        return;
    }
}


/* =========================================
   SEGUNDA TENTATIVA
========================================= */

function prepararSegundaTentativa() {

    respondendo = true;


    resultadoElemento.textContent =
        "⚠ VOCÊ AINDA TEM UMA CHANCE!";


    resultadoElemento.style.color =
        "#b9b879";


    resultadoElemento.classList.add(
        "resultado-aparecer"
    );


    /*
     * Reativa somente os botões.
     */

    const botoes =
        alternativasElemento
            .querySelectorAll("button");


    botoes.forEach(botao => {

        botao.disabled = false;

        botao.style.cursor =
            "pointer";


        /*
         * Remove a marcação visual
         * da resposta errada.
         */

        botao.classList.remove(
            "wrong"
        );

    });
}


/* =========================================
   ATIVAR MÁSCARA
========================================= */

function ativarMascara() {

    /*
     * Evita ativar novamente.
     */

    if (mascaraQuebrada) {
        return;
    }


    mascaraQuebrada = true;


    /*
     * Ativa a máscara.
     */

    mascaraOverlay.classList.add(
        "ativo"
    );


    /*
     * Começa a quebrar as lentes.
     */

    setTimeout(() => {

        mascaraOverlay.classList.add(
            "quebrando"
        );

    }, 500);


    /*
     * Depois mostra as rachaduras
     * e o sangue.
     */

    setTimeout(() => {

        mascaraOverlay.classList.add(
            "quebrada"
        );

    }, 1000);


    /*
     * Ativa a barra de sanidade.
     */

    iniciarSanidade();
}


/* =========================================
   SANIDADE
========================================= */

function iniciarSanidade() {

    /*
     * Evita criar mais de um cronômetro.
     */

    if (tempoSanidade !== null) {
        return;
    }


    sanidadeContainer.classList.add(
        "ativo"
    );


    inicioSanidade = Date.now();


    tempoSanidade = setInterval(() => {

        const agora = Date.now();


        const decorrido =
            (agora - inicioSanidade) / 1000;


        /*
         * Calcula a perda de sanidade
         * baseada no tempo.
         */

        const perda =
            decorrido / TEMPO_SANIDADE;


        sanidadeAtual =
            Math.max(
                0,
                sanidadeAtual - perda
            );


        /*
         * Reinicia o contador.
         */

        inicioSanidade = agora;


        /*
         * Atualiza visualmente a barra.
         */

        sanidadeProgresso.style.transform =
            `scaleY(${sanidadeAtual})`;


        /*
         * Estado crítico abaixo de 30%.
         */

        if (sanidadeAtual <= 0.30) {

            sanidadeContainer.classList.add(
                "critica"
            );

        } else {

            sanidadeContainer.classList.remove(
                "critica"
            );

        }


        /*
         * Sanidade acabou.
         */

        if (sanidadeAtual <= 0) {

            clearInterval(
                tempoSanidade
            );


            tempoSanidade = null;


            morrerPorSanidade();

        }

    }, 100);
}


/* =========================================
   RECUPERAR SANIDADE
========================================= */

function recuperarSanidade() {

    /*
     * Recupera 40% da sanidade.
     */

    sanidadeAtual +=
        SANIDADE_POR_ACERTO;


    /*
     * Nunca ultrapassa 100%.
     */

    sanidadeAtual =
        Math.min(
            SANIDADE_MAXIMA,
            sanidadeAtual
        );


    /*
     * Atualiza a barra imediatamente.
     */

    sanidadeProgresso.style.transform =
        `scaleY(${sanidadeAtual})`;


    /*
     * Se saiu da zona crítica,
     * remove o estado crítico.
     */

    if (sanidadeAtual > 0.30) {

        sanidadeContainer.classList.remove(
            "critica"
        );

    }
}


/* =========================================
   MORTE POR SANIDADE
========================================= */

function morrerPorSanidade() {

    /*
     * Impede respostas durante a morte.
     */

    respondendo = false;


    mascaraOverlay.classList.add(
        "morrendo"
    );


    /*
     * Pequena pausa antes de Gilbert.
     */

    setTimeout(() => {

        mostrarGilbert();

    }, 800);
}


/* =========================================
   FINALIZAR QUIZ
========================================= */

function finalizarQuiz() {

    /*
     * Para o cronômetro.
     */

    if (tempoSanidade !== null) {

        clearInterval(
            tempoSanidade
        );

        tempoSanidade = null;
    }


    /*
     * Remove a barra de sanidade.
     */

    sanidadeContainer.classList.remove(
        "ativo"
    );


    /*
     * O quiz terminou normalmente.
     */

    mostrarResultado();
}


/* =========================================
   RESULTADO FINAL
========================================= */

function mostrarResultado() {

    perguntaElemento.classList.remove(
        "nova-pergunta"
    );


    perguntaElemento.textContent =
        "QUIZ FINALIZADO!";


    alternativasElemento.innerHTML = "";


    const porcentagem =
        Math.round(
            (pontos / perguntas.length) * 100
        );


    resultadoElemento.textContent =
        `Você acertou ${pontos} de ${perguntas.length} perguntas. (${porcentagem}%)`;


    resultadoElemento.classList.add(
        "resultado-aparecer"
    );


    /* =====================================
       MENSAGEM FINAL
    ===================================== */

    const mensagem =
        document.createElement("p");


    mensagem.id =
        "mensagem-final";


    if (porcentagem === 100) {

        mensagem.textContent =
            "★ MISSÃO CUMPRIDA! ★";

    } else if (porcentagem >= 70) {

        mensagem.textContent =
            "Boa missão, Conscript!";

    } else if (porcentagem >= 50) {

        mensagem.textContent =
            "Missão parcialmente concluída.";

    } else {

        mensagem.textContent =
            "Treinamento necessário.";
    }


    quizContainer.appendChild(
        mensagem
    );


    /* =====================================
       BOTÃO DE REINICIAR
    ===================================== */

    const botaoReset =
        document.createElement("button");


    botaoReset.textContent =
        "↻ REINICIAR QUIZ";


    botaoReset.id =
        "reset";


    botaoReset.onclick =
        reiniciarQuiz;


    alternativasElemento.appendChild(
        botaoReset
    );
}


/* =========================================
   REINICIAR MANUALMENTE
========================================= */

function reiniciarQuiz() {

    quizContainer.classList.add(
        "resetando"
    );


    setTimeout(() => {

        resetarEstado();


        quizContainer.classList.remove(
            "resetando"
        );


        mostrarPergunta();

    }, 600);
}


/* =========================================
   RESETAR ESTADO
========================================= */

function resetarEstado() {

    /*
     * Para sanidade.
     */

    if (tempoSanidade !== null) {

        clearInterval(
            tempoSanidade
        );

        tempoSanidade = null;
    }


    /*
     * Reinicia variáveis.
     */

    perguntaAtual = 0;

    pontos = 0;

    errosNaPergunta = 0;

    sanidadeAtual =
        SANIDADE_MAXIMA;

    mascaraQuebrada = false;

    respondendo = false;


    /*
     * Remove máscara.
     */

    mascaraOverlay.classList.remove(
        "ativo",
        "quebrando",
        "quebrada",
        "morrendo"
    );


    /*
     * Remove barra.
     */

    sanidadeContainer.classList.remove(
        "ativo",
        "critica"
    );


    /*
     * Restaura barra para 100%.
     */

    sanidadeProgresso.style.transform =
        "scaleY(1)";


    /*
     * Limpa resultado.
     */

    resultadoElemento.textContent = "";


    /*
     * Remove mensagem final.
     */

    const mensagemFinal =
        document.getElementById(
            "mensagem-final"
        );


    if (mensagemFinal) {

        mensagemFinal.remove();

    }
}


/* =========================================
   MORTE PELO GILBERT
========================================= */

function mostrarGilbert() {

    /*
     * Para respostas.
     */

    respondendo = false;


    /*
     * Para a sanidade.
     */

    if (tempoSanidade !== null) {

        clearInterval(
            tempoSanidade
        );

        tempoSanidade = null;
    }


    const overlay =
        document.getElementById(
            "gilbert-overlay"
        );


    const imagem =
        document.getElementById(
            "gilbert-img"
        );


    /*
     * Remove animações anteriores
     * para permitir repetir.
     */

    overlay.classList.remove(
        "ativo",
        "flash"
    );


    imagem.classList.remove(
        "gilbert-ataque"
    );


    /*
     * Força reinício da animação.
     */

    void overlay.offsetWidth;


    /*
     * Tela preta.
     */

    overlay.classList.add(
        "ativo"
    );


    /*
     * Gilbert aparece e ataca.
     */

    setTimeout(() => {

        imagem.classList.add(
            "gilbert-ataque"
        );


        overlay.classList.add(
            "flash"
        );


        setTimeout(() => {

            imagem.classList.remove(
                "gilbert-ataque"
            );


            overlay.classList.remove(
                "flash"
            );

        }, 500);

    }, 1000);


    /*
     * Depois de Gilbert,
     * reinicia completamente.
     */

    setTimeout(() => {

        reiniciarDepoisDoGilbert();

    }, 4500);
}


/* =========================================
   REINICIAR DEPOIS DA MORTE
========================================= */

function reiniciarDepoisDoGilbert() {

    const overlay =
        document.getElementById(
            "gilbert-overlay"
        );


    /*
     * Remove tela de Gilbert.
     */

    overlay.classList.remove(
        "ativo"
    );


    /*
     * Reseta tudo:
     *
     * pontos = 0
     * pergunta = 1
     * máscara = normal
     * sanidade = 100%
     */

    resetarEstado();


    /*
     * Volta para a primeira pergunta.
     */

    mostrarPergunta();
}


/* =========================================
   INICIAR QUIZ
========================================= */

mostrarPergunta();
