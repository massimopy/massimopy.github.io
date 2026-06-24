const hours_dec = document.querySelector(".ore-decine"); // decine delle ore
const hours_uni = document.querySelector(".ore-unità"); // unità delle ore
const minutes_dec = document.querySelector(".minuti-decine"); //  decine dei minuti
const minutes_uni = document.querySelector(".minuti-unità"); // unità dei minuti
const seconds_dec = document.querySelector(".secondi-decine"); // decine dei secondi
const seconds_uni = document.querySelector(".secondi-unità"); // untià dei secondi
const start_button_image = document.querySelector(".stop-button img"); // bottone per avvio/stop del cronometro
const start_button = document.querySelector(".stop-button"); // bottone di avvio
const reset_button = document.querySelector(".reset-button"); // bottone di reset
const full_screen_button = document.querySelector(".fullscreen"); // bottone full screen
let elem = document.documentElement; // elemento tag html

let timer_duration = 0; // durata timer
let elapsed_time = 0; // tempo trascordo dall'avvio del timer
let start_time = 0; // ora di inizio del timer
let timer_interval = null; // per il loop del timer

let hours_dec_original = "0";
let hours_uni_original = "0";
let minutes_dec_original = "0";
let minutes_uni_original = "0";
let seconds_dec_original = "0";
let seconds_uni_original = "0";

function avvia_timer() {
  let time_passed = Date.now() - start_time + elapsed_time; // calcola il tempo passato dall'avvio del timer facendo l'ora attuale - l'ora a cui il timer è iniziato + il tempo che è già passato
  let time_remaning = timer_duration - time_passed; // tempo rimasto alla finer del timer
  let date_obj = new Date(time_remaning); // crea un obj che contiene il tempo rimanente in millisecondi

  if (timer_duration <= time_passed) {
    clearInterval(timer_interval);
    timer_duration = 0;
    elapsed_time = 0;
    start_time = 0;
    timer_interval = null;

    start_button_image.src = "img/go-button.png";

    hours_dec.textContent = "0";
    hours_uni.textContent = "0";
    minutes_dec.textContent = "0";
    minutes_uni.textContent = "0";
    seconds_dec.textContent = "0";
    seconds_uni.textContent = "0";

    return;
  }

  let hours = date_obj.getUTCHours(); // estra le ore dal obj
  let minutes = date_obj.getUTCMinutes(); // estrae i minuti dal obj
  let seconds = date_obj.getUTCSeconds(); // estra i secondi dal obj

  let minutes_str = String(minutes).padStart(2, "0"); // se la stringa è "5" diventa "05"
  let seconds_str = String(seconds).padStart(2, "0");
  let hours_str = String(hours).padStart(2, "0");

  // aggiorna il contenuto dei counters
  hours_dec.textContent = hours_str[0];
  hours_uni.textContent = hours_str[1];

  minutes_dec.textContent = minutes_str[0];
  minutes_uni.textContent = minutes_str[1];

  seconds_dec.textContent = seconds_str[0];
  seconds_uni.textContent = seconds_str[1];
}

start_button.addEventListener("click", function () {
  // ascolta per un click sul bottone
  if (start_button_image.getAttribute("src") === "img/go-button.png") {
    if (elapsed_time === 0) {
      // se il timer viene avviato per la prima volta e non fatto ripartire dopo la pausa
      // calcolo durata del timer
      hours_dec_original = hours_dec.innerText;
      hours_uni_original = hours_uni.innerText;
      minutes_dec_original = minutes_dec.innerText;
      minutes_uni_original = minutes_uni.innerText;
      seconds_dec_original = seconds_dec.innerText;
      seconds_uni_original = seconds_uni.innerText;

      timer_duration += hours_dec_original * 10 * 60 * 60 * 1000;
      timer_duration += hours_uni_original * 60 * 60 * 1000;
      timer_duration += minutes_dec_original * 10 * 60 * 1000;
      timer_duration += minutes_uni_original * 60 * 1000;
      timer_duration += seconds_dec_original * 10 * 1000;
      timer_duration += seconds_uni_original * 1000;
    }
    start_time = Date.now(); // prede il momento in cui il timer è stato avviato
    start_button_image.src = "img/stop-button.webp"; // cambia l'immagine del bottone

    avvia_timer(); // avvia il timer
    timer_interval = setInterval(avvia_timer, 10); // avvia un intervallo che ogni 10ms chiama la funzione avvia_timer per aggionrare il display
  } else {
    // Stop del timer
    start_button_image.src = "img/go-button.png"; // cambia l'immagine
    clearInterval(timer_interval); // elimina l'intervallo in modo da non chiamare la funzione se il timer non è attivo
    elapsed_time += Date.now() - start_time; // calcolo del tempo passato dall'avvio del timer
  }
});

function azzera_timer() {
  clearInterval(timer_interval); // elimina l'interavvlo in modo da non chiamare più avvia_timer

  hours_dec.textContent = hours_dec_original;
  hours_uni.textContent = hours_uni_original;
  minutes_dec.textContent = minutes_dec_original;
  minutes_uni.textContent = minutes_uni_original;
  seconds_dec.textContent = seconds_dec_original;
  seconds_uni.textContent = seconds_uni_original;

  // azzera la variabili gloabi
  timer_duration = 0;
  elapsed_time = 0;
  start_time = 0;
  timer_interval = null;

  start_button_image.src = "img/go-button.png";
}

reset_button.addEventListener("click", azzera_timer);

function set_full_screen() {
  if (!document.fullscreenElement) {
    // se non è full screen
    elem.requestFullscreen(); // mette lo schermo full screen
    full_screen_button.src = "img/exit_full_screen.png"; // cambia l'immagine del bottone
  } else {
    // se è già in full screen
    document.exitFullscreen(); // toglie il full screen
    full_screen_button.src = "img/full_screen.png"; // cambia l'immagine del bottone
  }
}

full_screen_button.addEventListener("click", set_full_screen);
