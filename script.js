// Selezioniamo i puntatorilet elementiMazzo = document.querySelectorAll('.card');
const elementiMazzo = document.querySelectorAll(".card");
const container = document.querySelector(".grid");
const rigioca = document.getElementById("rigioca");
const punteggio = document.getElementById("punteggio");
const timer = document.getElementById("timer");
const testoCentrale = document.getElementById("testoCentrale");

// Convertiamo le carte da NodeList ad Array
let mazzo = Array.from(elementiMazzo);

// Inizializza il gioco quando la pagina è caricata
window.onload = () => {
  iniziaAGiocare();
  avviaTimer();
};

//Prompt di richiesta del nome e successiva stampa in pagina
let richiestaNome = prompt("Sei pronto? Inserisci il tuo nome?");
let titolo = document.getElementById("titolo");
titolo.textContent = `Trova la coppia, ${richiestaNome}!`;

// Variabili che utilizziamo per salvare e successivamente confrontare le carte
let primaCarta = null;
let secondaCarta = null;

// Inizializziamo il punteggio a 0
let score = 0;

// Creiamo le variabili da sfruttare col timer
let timerInterval;
let tempo = 0;

// Funzione per mischiare il mazzo
function mischiaCarte(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let numeroRandom = Math.floor(Math.random() * (i + 1));
    [array[i], array[numeroRandom]] = [array[numeroRandom], array[i]]; // questa riga serve per mischiare gli indici
    //invertendo ogni indice con un indice random compreso nella lunghhezza dell'array
  }
  return array;
}

// Funzione che aggiorna il punteggio
function aggiornaPunteggio() {
  score++;
  punteggio.innerText = `Punteggio: ${score}`;
}

// Funzione che fa partire il timer e lo aggiorna ad ogni secondo
function avviaTimer() {
  timerInterval = setInterval(() => {
    tempo++;
    let minuti = Math.floor(tempo / 60);
    let secondi = tempo % 60;
    timer.innerText = `${minuti < 10 ? "0" + minuti : minuti}:${
      secondi < 10 ? "0" + secondi : secondi
    }`;
  }, 1000);
}
//logica per fermare il timer
function fermaTimer() {
  clearInterval(timerInterval);
}

// Funzione di confronto delle coppie
function controlloCarte() {
  if (primaCarta.textContent === secondaCarta.textContent) {
    //se le carte sono uguali si aggiorna il punteggio e
    aggiornaPunteggio(); //vengono nascoste, si resettano i valori delle variabili
    setTimeout(() => {
      //e in caso non vi siano più carte termina il gioco
      primaCarta.style.visibility = "hidden";
      secondaCarta.style.visibility = "hidden";
      resetCarte();
      verificaFineGioco();
    }, 500);
  } else {
    //se le carte non sono uguali le riporta alla posizione orginale
    setTimeout(() => {
      reverseFlip(primaCarta);
      reverseFlip(secondaCarta);
      resetCarte();
    }, 500);
  }
}
//resetta i valori delle variabili di confronto delle carte
function resetCarte() {
  primaCarta = null;
  secondaCarta = null;
}
//se tutte le carte sono state rimosse dal terreno e in tal caso cambia la visualizzazione della griglia
function verificaFineGioco() {
  if (mazzo.every((carta) => carta.style.visibility === "hidden")) {
    fermaTimer();
    modificaCentro();
  }
}

// Funzione per iniziare a giocare che faremo partire al caricamento della finestra e poi col rigioca
function iniziaAGiocare() {
  resetCarte();

  let mazzoMischiato = mischiaCarte(mazzo);
  container.innerHTML = ""; // Svuota il container delle carte
  mazzoMischiato.forEach((carta) => {
    container.append(carta); //appende le carte una volta mischiate
    carta.classList.remove("hidden"); //Rende le carte visibili

    carta.textContent = ""; // Nasconde il valore inizialmente
    carta.addEventListener("click", () => {
      carta.classList.remove("reverseflip"); //rimozione della classe reverseflip
      if (!primaCarta) {
        //
        flipCard(carta);
        primaCarta = carta; //qui se non c'è alcuna carta selezionata viene girata ne viene salvato il valore in una variabile di confronto
      } else if (!secondaCarta && carta !== primaCarta) {
        secondaCarta = carta; //quando si pesca la seconda viene girata ed entra nella funzione di controllo
        flipCard(carta);

        controlloCarte();
      }
    });
  });
}
// funzione che gira le carte mostrandone il valore e
function flipCard(carta) {
  carta.textContent = carta.value;
  carta.classList.add("flip");
  carta.classList.remove("bgCard");
}
//riporta le carte alla posizione originale
function reverseFlip(carta) {
  carta.textContent = "";
  carta.classList.add("reverseflip");
  carta.classList.remove("flip");
  carta.classList.add("bgCard");
}

//rende le carte di nuovo visibili
function rendiTutteLeCarteVisibili() {
  mazzo.forEach((carta) => {
    carta.style.visibility = "visible";
    carta.classList.add("bgCard");
  });
}
//Cambia il contenuto della griglia inserendo il messaggio di vittoria
function modificaCentro() {
  titolo.innerText = "";
  container.classList.remove("grid", "grid-cols-4");
  container.classList.add("flex", "items-center", "justify-center");
  container.innerHTML = `Complimenti ${richiestaNome}, hai terminato la partita in ${tempo} secondi.`;
}

// Aggiungi un listener per il pulsante di reset
rigioca.addEventListener("click", () => {
  container.classList.remove("flex", "items-center", "justify-center");
  container.classList.add("grid", "grid-cols-4");
  rendiTutteLeCarteVisibili();
  mischiaCarte(mazzo);
  score = 0;
  punteggio.innerText = `Punteggio: ${score}`;
  tempo = 0;
  fermaTimer();
  iniziaAGiocare();
  avviaTimer();
});
