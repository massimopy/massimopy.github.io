const counter = document.querySelector(".counter");
const goal = document.querySelector(".goal");
const add_button = document.querySelector(".piu");
const remove_button = document.querySelector(".meno");
const full_screen_button = document.querySelector(".fullscreen");
const mic_button = document.querySelector(".mic-button");
const mic_button_image = document.querySelector(".mic-button img");

let recognition = null;

let count = 0;
function increment_counter() {
  if (count == goal.textContent) {
    // vocale_answer("hai raggiunto l'obbiettivo")
    return;
  }

  count++;
  if (count == goal.textContent) {
    vocale_answer("hai raggiunto l'obbiettivo");
  }
  counter.textContent = String(count).padStart(2, "0");
}

add_button.addEventListener("click", increment_counter);

function decrement_counter() {
  if (count === 0) {
    return;
  }
  count--;
  counter.textContent = String(count).padStart(2, "0");
}

remove_button.addEventListener("click", decrement_counter);

function set_full_screen() {
  let elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
    full_screen_button.src = "img/exit_full_screen.png";
  } else {
    document.exitFullscreen();
    full_screen_button.src = "img/full_screen.png";
  }
}

full_screen_button.addEventListener("click", set_full_screen);

let domande = ["quante", "a che", "quanto"];
let comandi = ["imposta", "metti", "aggiugni", "crea", "obbiettivo"];
let comandi_aumento = ["aumenta", "piu", "più", "aggiungi", "incrementa"];
let comandi_diminuzione = [
  "diminuisci",
  "meno",
  "togli",
  "rimuovi",
  "sottrai",
  "decrementa",
  "diminuisce",
];
function vocal_listner() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    if (recognition !== null) {
      mic_button_image.src = "/templates/img/mic.png";
      recognition.stop();
      recognition = null;
      return;
    }
    mic_button_image.src = "/templates/img/mic_active.png";
    recognition = new SpeechRecognition();

    recognition.lang = "it-IT";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const indiceUltimoRisultato = event.results.length - 1;
      let testoTrascritto = event.results[indiceUltimoRisultato][0].transcript;
      testoTrascritto = testoTrascritto.toLowerCase().trim();
      console.log("Hai detto: " + testoTrascritto);
      if (
        domande.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        vocale_answer(
          `sei a ${parseInt(counter.textContent)} su ${parseInt(goal.textContent)}`,
        );
      } else if (
        comandi.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        vocal_command(testoTrascritto);
      } else if (
        comandi_aumento.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        increment_counter();
      } else if (
        comandi_diminuzione.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        decrement_counter();
      }
    };
    recognition.addEventListener("end", function () {
      if (recognition !== null) {
        recognition.start();
      }
    });

    recognition.start();
  }
}

function vocale_answer(text) {
  let messaggio = new SpeechSynthesisUtterance(text);

  messaggio.lang = "it-IT";
  messaggio.rate = 1.4;
  messaggio.pitch = -30.0;

  let vociDisponibili = window.speechSynthesis.getVoices();

  // Cerchiamo la voce con la funzione classica anziché la arrow function
  let voceItaliana = vociDisponibili.find(function (voce) {
    return voce.lang.indexOf("it") === 0;
  });
  window.speechSynthesis.speak(messaggio);
}

mic_button.addEventListener("click", vocal_listner);

function vocal_command(testo_pronunciato) {
  testo_pronunciato = testo_pronunciato
    .toLowerCase()
    .replaceAll("uno", "1")
    .replaceAll("due", "2")
    .replaceAll("tre", "3")
    .replaceAll("quattro", "4")
    .replaceAll("cinque", "5")
    .replaceAll("sei", "6")
    .replaceAll("sette", "7")
    .replaceAll("otto", "8")
    .replaceAll("nove", "9")
    .replaceAll("zero", "0");

  let obbiettivo;
  let numeri = testo_pronunciato.match(/\d+/g);

  if (numeri) {
    obbiettivo = numeri.join("");
  } else {
    obbiettivo = "00";
  }

  goal.textContent = obbiettivo;
  counter.textContent = "00";
  count = 0;
}
