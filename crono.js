// Selettori corretti con le virgolette
const millis_dec = document.querySelector(".decimi"); // decimi
const millis_uni = document.querySelector(".centesimi"); // centesimi
const minutes_dec = document.querySelector(".minuti-decine"); //  decine dei minuti
const minutes_uni = document.querySelector(".minuti-unità"); // unità dei minuti
const seconds_dec = document.querySelector(".secondi-decine"); // decine dei secondi
const seconds_uni = document.querySelector(".secondi-unità"); // untià dei secondi
const start_button_image = document.querySelector(".stop-button img"); // bottone per avvio/stop del cronometro
const start_button = document.querySelector(".stop-button");
const reset_button = document.querySelector(".reset-button");

let start_time; // tempo di avvio del timer
let timer_interval;
let running_timer = false; // controllo se il crono è stato avviato
let elapsed_time = 0; // tempo trascorso dall'avvio del timer

function avvia_cronometro() {
  let time_passed = Date.now() - start_time + elapsed_time; // calcola il tempo passato dall'avvio del crono facendo: data attuale - tempo passato + tempo di attivià del crono
  let date_obj = new Date(time_passed); // crea un obj che contiene i millisecondi trascorsi dal 1/1/1970

  let minutes = date_obj.getUTCMinutes(); // estrae i minuti dal obj
  let seconds = date_obj.getUTCSeconds(); // estra i secondi dal obj
  let centiseconds = Math.floor(date_obj.getUTCMilliseconds() / 10); // estra i centesimi dal obj e gli arrotonda

  let minutes_str = String(minutes).padStart(2, "0"); // se la stringa è "5" diventa "05"
  let seconds_str = String(seconds).padStart(2, "0");
  let centi_str = String(centiseconds).padStart(2, "0");

  // Aggiornamento DOM modificando il valore dei vaori counter
  minutes_dec.textContent = minutes_str[0];
  minutes_uni.textContent = minutes_str[1];
  seconds_dec.textContent = seconds_str[0];
  seconds_uni.textContent = seconds_str[1];
  millis_dec.textContent = centi_str[0];
  millis_uni.textContent = centi_str[1];
}

start_button.addEventListener("click", function () {
  // ascolta per un click sul bottone
  if (start_button_image.getAttribute("src") === "img/go-button.png") {
    // se il timer non è ancora partito
    running_timer = true; // imposta che il crono è partito
    start_time = Date.now(); // prede il momento in cui il crono è stato avviato
    start_button_image.src = "img/stop-button.webp"; // cambia l'immagine del bottone

    avvia_cronometro(); // avvia il cronometro
    timer_interval = setInterval(avvia_cronometro, 10); // avvia un intervallo che ogni 10ms chiama la funzione avvia_cronometro
  } else {
    // Stop del cronometro
    running_timer = false; // imposta che il timer non è più attivo
    start_button_image.src = "img/go-button.png"; // cambia l'immagine
    clearInterval(timer_interval); // elimina l'intervallo in modo da non chiamare la funzione se il crono non è attivo
    elapsed_time += Date.now() - start_time; // calcolo del tempo passato dall'avvio del crono
  }
});

function azzera_cronometro() {
  clearInterval(timer_interval);

  minutes_dec.textContent = "0";
  minutes_uni.textContent = "0";
  seconds_dec.textContent = "0";
  seconds_uni.textContent = "0";
  millis_dec.textContent = "0";
  millis_uni.textContent = "0";

  start_time = 0;
  running_timer = false;
  elapsed_time = 0;

  start_button_image.src = "img/go-button.png";
}

reset_button.addEventListener("click", azzera_cronometro);


