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
const full_screen_button = document.querySelector(".fullscreen");
const mic_button = document.querySelector(".mic-button");
const mic_button_image = document.querySelector(".mic-button img");
let elem = document.documentElement;

let start_time; // tempo di avvio del timer
let timer_interval;
let running_timer = false; // controllo se il crono è stato avviato
let elapsed_time = 0; // tempo trascorso dall'avvio del timer

let recognition = null;

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

function stop_cronometro() {
  running_timer = false; // imposta che il timer non è più attivo
  start_button_image.src = "img/go-button.png"; // cambia l'immagine
  clearInterval(timer_interval); // elimina l'intervallo in modo da non chiamare la funzione se il crono non è attivo
  elapsed_time += Date.now() - start_time; // calcolo del tempo passato dall'avvio del crono
}
function gestisci_cronometro() {
  if (start_button_image.getAttribute("src") === "img/go-button.png") {
    // se il timer non è ancora partito
    running_timer = true; // imposta che il crono è partito
    start_time = Date.now(); // prede il momento in cui il crono è stato avviato
    start_button_image.src = "img/stop-button.webp"; // cambia l'immagine del bottone

    avvia_cronometro(); // avvia il cronometro
    timer_interval = setInterval(avvia_cronometro, 10); // avvia un intervallo che ogni 10ms chiama la funzione avvia_cronometro
  } else {
    // Stop del cronometro
    stop_cronometro();
  }
}

start_button.addEventListener("click", gestisci_cronometro);

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

let domande = ["tempo", "a che punto", "quanto", "quante"];
let comandi_avvio = ["avvia", "fai", "partire", "parti", "via"];
let comandi_pausa = ["stop", "fermo", "fermati", "pausa", "basta"];
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
        vocale_answer();
      } else if (
        !running_timer &&
        comandi_avvio.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        gestisci_cronometro();
      }
      else if (
        running_timer &&
        comandi_pausa.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        stop_cronometro();
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

function vocale_answer() {
  let messaggio = "sono passati ";
  let count = 0;

  if (minutes_uni.innerText != 0) {
    count += parseInt(minutes_uni.innerText);

    if (minutes_dec.innerText != 0) {
      count += parseInt(minutes_dec.innerText) * 10;
    }

    if (minutes_uni.innerText == 1 && minutes_dec.innerText == 0) {
      messaggio += `${count} minuto e `;
    } else {
      messaggio += `${count} minuti e`;
    }
  }
  count = 0;

  if (seconds_uni.innerText != 0) {
    count += parseInt(seconds_uni.innerText);
  }
  if (seconds_dec.innerText != 0) {
    count += parseInt(seconds_dec.innerText) * 10;
  }
  messaggio += `${count + 2} secondi`;
  count = 0;

  messaggio = new SpeechSynthesisUtterance(`${messaggio}`);

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
