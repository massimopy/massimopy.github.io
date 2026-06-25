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
const mic_button = document.querySelector(".mic-button");
const mic_button_image = document.querySelector(".mic-button img");
// riga 184 far si che il timer parta e si stoppi con la voce problema: con la voce non cambia l'icona del bottone
let timer_duration = 0; // durata timer
let elapsed_time = 0; // tempo trascordo dall'avvio del timer
let start_time = 0; // ora di inizio del timer
let timer_interval = null; // per il loop del timer

let recognition = null;

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
    vocal_senteces("ooooooooooooooooooooooooooooooooooooooooo");

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

function gestione_avvio_timer() {
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
}
start_button.addEventListener("click", gestione_avvio_timer);

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

let domande = ["tempo", "a che punto", "quanto"];
let comandi = ["imposta", "metti", "aggiugni", "crea"];
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
        comandi.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        vocal_command(testoTrascritto);
      } else if (
        comandi_avvio.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        gestione_avvio_timer();
      } else if (
        comandi_pausa.some(function (d) {
          return testoTrascritto.includes(d);
        })
      ) {
        gestione_avvio_timer();
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
  let messaggio = "mancano ";
  let count = 0;

  if (hours_uni.innerText != 0) {
    count += parseInt(hours_uni.innerText);

    if (hours_dec.innerText != 0) {
      count += parseInt(hours_dec.innerText) * 10;
    }

    if (hours_uni.innerText == 1 && hours_dec.innerText == 0) {
      messaggio += `${count} ora `;
    } else {
      messaggio += `${count} ore `;
    }
  }
  count = 0;

  if (minutes_uni.innerText != 0) {
    count += parseInt(minutes_uni.innerText);

    if (minutes_dec.innerText != 0) {
      count += parseInt(minutes_dec.innerText) * 10;
    }

    if (minutes_uni.innerText == 1) {
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
  messaggio += `${count - 2} secondi`;

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

  let ore;
  let minuti;
  let secondi;

  let regex = /(\d+)\s+or[ae]/i;
  let comando = testo_pronunciato.match(regex);
  if (comando) {
    ore = comando[1].padStart(2, "0");
  } else {
    ore = "00";
  }

  regex = /(\d+)\s+minut[io]/i;
  comando = testo_pronunciato.match(regex);
  if (comando) {
    minuti = comando[1].padStart(2, "0");
  } else {
    minuti = "00";
  }

  regex = /(\d+)\s+second[io]/i;
  comando = testo_pronunciato.match(regex);

  if (comando) {
    secondi = comando[1].padStart(2, "0");
  } else {
    secondi = "00";
  }

  hours_dec.textContent = ore[0];
  hours_uni.textContent = ore[1];

  minutes_dec.textContent = minuti[0];
  minutes_uni.textContent = minuti[1];

  seconds_dec.textContent = secondi[0];
  seconds_uni.textContent = secondi[1];
}

function vocal_senteces(text) {
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
