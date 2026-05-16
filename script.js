/*
  ============================================================
  MATHQUEST — script.js
  ============================================================
  Este arquivo cuida do COMPORTAMENTO do jogo.
  Aqui ficam as regras, a lógica e as ações.

  ORGANIZAÇÃO DO ARQUIVO:
  1. Banco de Perguntas   → as 20 perguntas do jogo
  2. Variáveis de Estado  → situação atual do jogo
  3. Referências HTML     → atalhos para os elementos
  4. Funções Auxiliares   → funções de apoio pequenas
  5. Funções do Jogo      → a lógica principal

  DICA: leia de cima para baixo. Cada seção tem comentários
  explicando o que faz e por que está ali.
  ============================================================
*/


/* ============================================================
   1. BANCO DE PERGUNTAS
   ============================================================
   Um array (lista) de objetos.
   Cada objeto é uma pergunta com:
     pergunta → texto exibido na tela
     opcoes   → as 4 alternativas (embaralhadas na hora)
     certa    → o valor correto
     dif      → dificuldade: "facil", "medio" ou "dificil"
============================================================ */
const perguntas = [

  // ---------- FÁCIL (7 perguntas — valem 100 pts cada) ----------
  { pergunta: "Quanto é  4 + 7?",              opcoes: [11, 9, 13, 12],      certa: 11,  dif: "facil"   },
  { pergunta: "Quanto é  3 × 5?",               opcoes: [15, 12, 18, 20],     certa: 15,  dif: "facil"   },
  { pergunta: "Quanto é  20 ÷ 4?",              opcoes: [5, 4, 6, 8],         certa: 5,   dif: "facil"   },
  { pergunta: "Quanto é  8 + 13?",              opcoes: [21, 19, 23, 22],     certa: 21,  dif: "facil"   },
  { pergunta: "Quanto é  6 × 6?",               opcoes: [36, 32, 40, 42],     certa: 36,  dif: "facil"   },
  { pergunta: "50% de 80 é igual a?",           opcoes: [40, 35, 45, 50],     certa: 40,  dif: "facil"   },
  { pergunta: "Quanto é  100 - 37?",            opcoes: [63, 67, 73, 57],     certa: 63,  dif: "facil"   },

  // ---------- MÉDIO (7 perguntas — valem 200 pts cada) ----------
  { pergunta: "Quanto é  12 × 8?",              opcoes: [96, 84, 108, 92],    certa: 96,  dif: "medio"   },
  { pergunta: "Quanto é  144 ÷ 12?",            opcoes: [12, 11, 13, 14],     certa: 12,  dif: "medio"   },
  { pergunta: "25% de 160 é igual a?",          opcoes: [40, 35, 45, 50],     certa: 40,  dif: "medio"   },
  { pergunta: "7² (sete ao quadrado) = ?",      opcoes: [49, 42, 56, 64],     certa: 49,  dif: "medio"   },
  { pergunta: "Raiz quadrada de 81 = ?",        opcoes: [9, 8, 7, 11],        certa: 9,   dif: "medio"   },
  { pergunta: "Se x + 5 = 14,  x = ?",         opcoes: [9, 7, 11, 8],        certa: 9,   dif: "medio"   },
  { pergunta: "3/4 de 200 = ?",                 opcoes: [150, 100, 175, 125], certa: 150, dif: "medio"   },

  // ---------- DIFÍCIL (6 perguntas — valem 300 pts cada) ----------
  { pergunta: "Se 2x - 3 = 11,  x = ?",              opcoes: [7, 5, 8, 9],     certa: 7,  dif: "dificil" },
  { pergunta: "Triângulo: base=10, altura=6. Área?",  opcoes: [30, 60, 15, 36], certa: 30, dif: "dificil" },
  { pergunta: "15% de 340 = ?",                       opcoes: [51, 45, 68, 34], certa: 51, dif: "dificil" },
  { pergunta: "Se x² = 169,  x = ?",                  opcoes: [13, 12, 14, 11], certa: 13, dif: "dificil" },
  { pergunta: "Sequência: 2, 5, 10, 17, ? ",          opcoes: [26, 24, 28, 22], certa: 26, dif: "dificil" },
  { pergunta: "Qual o perimetro do Retangulo: B=8, A=5?",  opcoes: [26, 40, 13, 30], certa: 26, dif: "dificil" },

];

//CONFIGURAÇÕES DO AUDIO DO GAME
// Cria os objetos de áudio apontando para a pasta src/
const somFundo    = new Audio("src/som-fundo.mp3");
const somAcerto   = new Audio("src/acerto.ogg");
const somErro     = new Audio("src/error.ogg");
const somVitoria  = new Audio("src/vitoria.ogg");
const somGameOver = new Audio("src/gameover.ogg");

// Música de fundo fica em loop
somFundo.loop   = true;
somFundo.volume = 0.4;  // 50% do volume

// Volume dos efeitos
somAcerto.volume   = 0.8; //80% do volume
somErro.volume     = 0.8; 
somVitoria.volume  = 0.9; //90%...
somGameOver.volume = 0.9;

// ── Funções chamadas pelo script.js ──────────────────


function tocarFundo() {
  somFundo.currentTime = 0; // volta pro início do som.
  somFundo.play();
}

function pararFundo() { //para quando der vitoria ou gameover para o jogador
  somFundo.pause();
  somFundo.currentTime = 0;
}

function tocarAcerto() {
  somAcerto.currentTime = 0; // reinicia o som, caso o jogador responda rápido a outra pergunta
  somAcerto.play();
}

function tocarErro() {
  somErro.currentTime = 0;
  somErro.play();
}

function tocarVitoria() {
  pararFundo();
  somVitoria.currentTime = 0;
  somVitoria.play();
}

function tocarGameOver() {
  pararFundo();
  somGameOver.currentTime = 0;
  somGameOver.play();
}

/* ============================================================
   2. VARIÁVEIS DE ESTADO DO JOGO
   ============================================================
   Estas variáveis guardam a situação atual enquanto joga.
   Quando o jogo reinicia, elas voltam aos valores iniciais.
============================================================ */
let indiceAtual = 0;     // qual pergunta estamos (0 = primeira, 19 = última)
let pontos      = 0;     // pontuação do jogador
let vidas       = 3;     // vidas restantes (começa com 3)
let respondeu   = false; // impede o jogador de clicar duas vezes na mesma pergunta


/* ============================================================
   3. REFERÊNCIAS AOS ELEMENTOS HTML
   ============================================================
   document.getElementById("id") busca um elemento pelo id.
   Guardamos em variáveis para não precisar repetir toda hora.
============================================================ */

// As 4 telas do jogo
const telaInicio   = document.getElementById("tela-inicio");
const telaJogo     = document.getElementById("tela-jogo");
const telaVitoria  = document.getElementById("tela-vitoria");
const telaGameover = document.getElementById("tela-gameover");

// Elementos do HUD
const elPontos   = document.getElementById("pontos");
const elVidas    = document.getElementById("vidas");
const elContador = document.getElementById("contador");
const elBarra    = document.getElementById("barra-progresso");
const elBadge    = document.getElementById("badge-dificuldade");

// Elementos da área de jogo
const elPergunta = document.getElementById("texto-pergunta");
const elGrade    = document.getElementById("grade-respostas");
const elFeedback = document.getElementById("feedback");


/* ============================================================
   4. FUNÇÕES AUXILIARES
   ============================================================
   Funções pequenas que ajudam as funções principais.
   São chamadas várias vezes em lugares diferentes.
============================================================ */

/*
  mostrarTela(tela)
  -----------------
  Esconde todas as telas e mostra apenas a que passamos.
  Parâmetro: tela → o elemento HTML que queremos mostrar
*/
function mostrarTela(tela) {
  // Adiciona .escondido em todas (display: none no CSS)
  telaInicio.classList.add("escondido");
  telaJogo.classList.add("escondido");
  telaVitoria.classList.add("escondido");
  telaGameover.classList.add("escondido");

  // Remove .escondido só da tela escolhida (ela aparece)
  tela.classList.remove("escondido");
}

/*
  embaralhar(array)
  -----------------
  Retorna uma cópia do array com os itens em ordem aleatória.
  Algoritmo usado: Fisher-Yates Shuffle.
  Exemplo: [1, 2, 3, 4] → pode virar [3, 1, 4, 2]
*/
function embaralhar(array) {
  // Cria uma cópia para não alterar o array original
  const copia = [...array];

  // Percorre de trás para frente
  for (let i = copia.length - 1; i > 0; i--) {
    // Escolhe uma posição aleatória entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));

    // Troca os itens de posição (desestruturação)
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

/*
  pontosValem(dificuldade)
  ------------------------
  Retorna quantos pontos a pergunta vale.
  Fácil = 100, Médio = 200, Difícil = 300.
*/
function pontosValem(dificuldade) {
  if (dificuldade === "facil")   return 100;
  if (dificuldade === "medio")   return 200;
  if (dificuldade === "dificil") return 300;
}

/*
  calcularRank(pontuacao)
  -----------------------
  Calcula o rank final baseado na porcentagem de pontos.
  Pontuação máxima possível: 7×100 + 7×200 + 6×300 = 3900 pts
*/
function calcularRank(pontuacao) {
  const pontosMaximos = (7 * 100) + (7 * 200) + (6 * 300); // = 3900
  const porcentagem   = pontuacao / pontosMaximos;

  if (porcentagem >= 0.90) return "S 🌟"; // 90% ou mais
  if (porcentagem >= 0.75) return "A";    // 75% ou mais
  if (porcentagem >= 0.55) return "B";    // 55% ou mais
  return "C";                             // abaixo de 55%
}


/* ============================================================
   5. FUNÇÕES PRINCIPAIS DO JOGO
   ============================================================
   Aqui fica a lógica central: iniciar, carregar pergunta,
   criar botões, verificar resposta e avançar.
============================================================ */

/*
  iniciarJogo()
  -------------
  Chamada pelo botão "Jogar" e "Jogar Novamente".
  Zera tudo e começa do início.
*/
function iniciarJogo() {
  // Reseta todas as variáveis de estado
  indiceAtual = 0;
  pontos      = 0;
  vidas       = 3;
  respondeu   = false;

  // Para a música caso o jogador esteja reiniciando
  pararFundo();
  // Inicia a música de fundo (só funciona após clique do usuário)
  tocarFundo();

  mostrarTela(telaJogo);
  carregarPergunta();
}

/*
  carregarPergunta()
  ------------------
  Pega a pergunta no índice atual e atualiza toda a interface.
  Chamada no início e após cada resposta.
*/
function carregarPergunta() {
  respondeu = false; // libera para responder de novo

  // Pega o objeto da pergunta atual
  const q = perguntas[indiceAtual];

  // ----- Atualiza o HUD -----
  elPontos.textContent   = pontos + " pts";
  elContador.textContent = (indiceAtual + 1) + " / " + perguntas.length;

  // Corações cheios + corações vazios conforme as vidas
  elVidas.textContent = "❤️".repeat(vidas) + "🖤".repeat(3 - vidas);

  // ----- Atualiza a barra de progresso -----
  // Calcula a porcentagem (0 a 100) e aplica como largura
  const porcentagem = (indiceAtual / perguntas.length) * 100;
  elBarra.style.width = porcentagem + "%";

  // ----- Atualiza o badge de dificuldade -----
  // Remove as classes antigas primeiro
  elBadge.className = "";

  if (q.dif === "facil") {
    elBadge.textContent = "FÁCIL";
    elBadge.className   = "badge-facil";
  } else if (q.dif === "medio") {
    elBadge.textContent = "MÉDIO";
    elBadge.className   = "badge-medio";
  } else {
    elBadge.textContent = "DIFÍCIL";
    elBadge.className   = "badge-dificil";
  }

  // ----- Atualiza o texto da pergunta -----
  elPergunta.textContent = q.pergunta;

  // ----- Esconde o feedback da pergunta anterior -----
  elFeedback.style.display = "none";
  elFeedback.className     = "";

  // ----- Cria os botões com as opções -----
  criarBotoes(q);
}

/*
  criarBotoes(q)
  --------------
  Limpa a grade e cria 4 botões com as opções embaralhadas.
  Parâmetro: q → objeto da pergunta atual
*/
function criarBotoes(q) {
  // Limpa os botões da pergunta anterior
  elGrade.innerHTML = "";

  // Embaralha as opções para não ficarem sempre na mesma posição
  const opcoes = embaralhar(q.opcoes);

  // Para cada opção, cria um botão dinamicamente
  opcoes.forEach(function(valor) {

    // Cria o elemento <button>
    const btn = document.createElement("button");
    btn.className   = "btn-resposta";
    btn.textContent = valor; // número da opção

    /*
      Quando o botão for clicado, chama verificarResposta.
      Usamos uma função anônima para "empacotar" os parâmetros,
      já que onclick não aceita parâmetros diretamente assim.
    */
    btn.onclick = function() {
      verificarResposta(valor, q.certa);
    };

    // Adiciona o botão dentro da grade
    elGrade.appendChild(btn);
  });
}

/*
  verificarResposta(valorEscolhido, valorCerto)
  ---------------------------------------------
  Chamada quando o jogador clica em uma resposta.
  Compara o valor clicado com o valor correto,
  atualiza pontos/vidas e mostra o feedback.

  Parâmetros:
    valorEscolhido → número no botão que foi clicado
    valorCerto     → número correto da pergunta
*/
function verificarResposta(valorEscolhido, valorCerto) {

  // Se já respondeu esta pergunta, ignora o clique
  if (respondeu) return;
  respondeu = true; // marca que já respondeu

  // Compara os valores (true ou false)
  const acertou = (valorEscolhido === valorCerto);

  // Pega todos os botões de resposta
  const botoes = elGrade.querySelectorAll(".btn-resposta");

  // Percorre cada botão para colorir o resultado
  botoes.forEach(function(btn) {

    // Converte o texto do botão para número (parseInt)
    const valorBtn = parseInt(btn.textContent);

    // Desativa todos os botões (não pode clicar de novo)
    btn.disabled = true;

    // Se este botão tem a resposta CERTA → pinta de verde
    if (valorBtn === valorCerto) {
      btn.disabled = false; // mantém visível (não fica apagado)
      btn.classList.add("btn-certo");
    }

    // Se este botão foi o ERRADO clicado → pinta de vermelho
    if (valorBtn === valorEscolhido && !acertou) {
      btn.disabled = false;
      btn.classList.add("btn-errado");
    }
  });

  // Atualiza pontos ou vidas conforme o resultado
  if (acertou) {
    pontos += pontosValem(perguntas[indiceAtual].dif);
    tocarAcerto();                      // ✅ som de acerto
    mostrarFeedback(true);
  } else {
    vidas--;
    tocarErro();                        // ❌ som de erro
    mostrarFeedback(false, valorCerto);
  }

  /*
    setTimeout(função, milissegundos)
    Aguarda 2500ms (2,5 segundos) antes de chamar avancar().
    Dá tempo para o jogador ver o feedback.
  */
  setTimeout(avancar, 2500); // ajuste este valor conforme a duração do seu som de erro
}

/*
  mostrarFeedback(acertou, valorCerto)
  ------------------------------------
  Exibe a mensagem de acerto ou erro embaixo dos botões.

  Parâmetros:
    acertou    → true = acertou, false = errou
    valorCerto → (só usado quando errou) mostra a resposta certa
*/
function mostrarFeedback(acertou, valorCerto) {
  elFeedback.style.display = "block"; // torna visível

  if (acertou) {
    elFeedback.className   = "feedback-certo";
    elFeedback.textContent = "✅ Correto! +" + pontosValem(perguntas[indiceAtual].dif) + " pontos";
  } else {
    elFeedback.className   = "feedback-errado";
    elFeedback.textContent = "❌ Errado! Resposta certa: " + valorCerto;
  }
}

/*
  avancar()
  ---------
  Chamada pelo setTimeout após o feedback.
  Decide o que acontece a seguir:
    → Sem vidas?        → Game Over
    → Fim das perguntas? → Vitória
    → Senão?             → Próxima pergunta
*/
function avancar() {

  // Verificação 1: jogador ficou sem vidas?
  if (vidas <= 0) {
    document.getElementById("pontos-gameover").textContent = pontos;
    tocarGameOver();                    // 💀 som de game over
    mostrarTela(telaGameover);
    return; // para a função aqui
  }

  // Vai para a próxima pergunta
  indiceAtual++;

  // Verificação 2: acabaram todas as perguntas?
  if (indiceAtual >= perguntas.length) {
    document.getElementById("pontos-vitoria").textContent = pontos;
    document.getElementById("vidas-vitoria").textContent  = vidas;
    document.getElementById("rank-final").textContent     = calcularRank(pontos);
    tocarVitoria();                     // 🏆 som de vitória
    mostrarTela(telaVitoria);
    return; // para a função aqui
  }

  // Se chegou aqui, o jogo continua normalmente
  carregarPergunta();
}
