// Selettori corretti con le virgolette
const hours_dec = document.querySelector(".ore-decine"); // ore decine
const hours_uni = document.querySelector(".ore-unità"); // ore unità
const minutes_dec = document.querySelector(".minuti-decine"); //  decine dei minuti
const minutes_uni = document.querySelector(".minuti-unità"); // unità dei minuti
const seconds_dec = document.querySelector(".secondi-decine"); // decine dei secondi
const seconds_uni = document.querySelector(".secondi-unità"); // untià dei secondi
const full_screen_button = document.querySelector(".fullscreen");
const mic_button = document.querySelector(".mic-button");
const mic_button_image = document.querySelector(".mic-button img");

let orario_interval = null;
let recognition = null;

function avvia_orario() {
  let date_obj = new Date(Date.now()); // crea un obj che contiene i millisecondi trascorsi dal 1/1/1970

  let hours = date_obj.getHours(); // estra le ore
  let minutes = date_obj.getMinutes(); // estrae i minuti dal obj
  let seconds = date_obj.getSeconds(); // estra i secondi dal obj

  let minutes_str = String(minutes).padStart(2, "0"); // se la stringa è "5" diventa "05"
  let seconds_str = String(seconds).padStart(2, "0");
  let hours_str = String(hours).padStart(2, "0");

  // Aggiornamento DOM modificando il valore dei vaori counter
  minutes_dec.textContent = minutes_str[0];
  minutes_uni.textContent = minutes_str[1];
  seconds_dec.textContent = seconds_str[0];
  seconds_uni.textContent = seconds_str[1];
  hours_dec.textContent = hours_str[0];
  hours_uni.textContent = hours_str[1];
}

window.addEventListener("DOMContentLoaded", function () {
  if (orario_interval === null) {
    avvia_orario();
    orario_interval = setInterval(avvia_orario, 100);
  }
});

function set_full_screen() {
  let elem = document.documentElement;
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
    full_screen_button.src = "templates/img/exit_full_screen.png";
  } else {
    document.exitFullscreen();
    full_screen_button.src = "templates/img/full_screen.png";
  }
}

full_screen_button.addEventListener("click", set_full_screen);

let domande = ["che ore sono", "che ora è", "che ora e", "dimmi il tempo"];

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
      if (domande.includes(testoTrascritto)) {
        vocal_speaker();
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

function vocal_speaker() {
  let secondi = parseInt(seconds_dec.textContent + seconds_uni.textContent) + 2;
  let messaggio = new SpeechSynthesisUtterance(
    `sono le ${hours_dec.textContent + hours_uni.textContent} e ${minutes_dec.textContent + minutes_uni.textContent} e ${secondi} secondi`,
  );

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
