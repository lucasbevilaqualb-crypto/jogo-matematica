/*
  ============================================================
  SERVICE WORKER — sw.js
  ============================================================
  O Service Worker é um "funcionário" que fica rodando
  em segundo plano no navegador.

  Ele tem dois trabalhos aqui:
    1. INSTALAR → baixa e guarda os arquivos do jogo
    2. INTERCEPTAR → quando o celular pede um arquivo,
       entrega do cache (sem precisar de internet)

  Isso é o que faz o jogo funcionar OFFLINE!
  ============================================================
*/


// Nome do cache — mude o número quando atualizar o jogo
// Ex: "mathquest-v2", "mathquest-v3"...
const NOME_CACHE = "mathquest-v1";

// Lista de todos os arquivos que precisam ser salvos offline
const ARQUIVOS = [
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./src/soom-fundo.mp3",      // ← adiciona esses
  "./src/acerto.mp3",
  "./src/error.mp3",
  "./src/vitoria.mp3",
  "./src/gameover.mp3",
  "./icone-192.png",
  "./icone-512.png",

];


/*
  EVENTO: install
  ---------------
  Roda UMA VEZ quando o Service Worker é instalado.
  Abre o cache e salva todos os arquivos da lista.
*/
self.addEventListener("install", function(evento) {

  // waitUntil garante que o SW não termina antes de salvar tudo
  evento.waitUntil(

    caches.open(NOME_CACHE).then(function(cache) {
      console.log("Cache aberto! Salvando arquivos...");
      return cache.addAll(ARQUIVOS);
    })

  );
});


/*
  EVENTO: activate
  ----------------
  Roda quando o SW assume o controle.
  Apaga caches antigos para não ocupar espaço.
*/
self.addEventListener("activate", function(evento) {

  evento.waitUntil(

    // Lista todos os caches existentes
    caches.keys().then(function(caches_existentes) {

      return Promise.all(
        caches_existentes.map(function(nome) {

          // Se o cache não é o atual, apaga
          if (nome !== NOME_CACHE) {
            console.log("Apagando cache antigo:", nome);
            return caches.delete(nome);
          }

        })
      );
    })

  );
});


/*
  EVENTO: fetch
  -------------
  Roda TODA VEZ que o app pede um arquivo (html, css, js...).
  Intercepta o pedido e entrega do cache.
  Se não tiver no cache, tenta buscar na internet.
*/
self.addEventListener("fetch", function(evento) {

  evento.respondWith(

    // Procura o arquivo no cache
    caches.match(evento.request).then(function(respostaDoCCache) {

      // Se encontrou no cache → entrega direto (sem internet!)
      if (respostaDoCCache) {
        return respostaDoCCache;
      }

      // Se não encontrou → tenta buscar na internet normalmente
      return fetch(evento.request);

    })

  );
});
