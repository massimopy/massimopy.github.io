// Selettori corretti con le virgolette
const hours_dec = document.querySelector(" .ore-decine"); // ore decine
const hours_uni = document.querySelector(".ore-unità"); // ore unità
const minutes_dec = document.querySelector(".minuti-decine"); //  decine dei minuti
const minutes_uni = document.querySelector(".minuti-unità"); // unità dei minuti
const seconds_dec = document.querySelector(".secondi-decine"); // decine dei secondi
const seconds_uni = document.querySelector(".secondi-unità"); // untià dei secondi

let orario_interval = null;

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
