const counter = document.querySelector(".counter");
const goal = document.querySelector(".goal");
const add_button = document.querySelector(".piu");
const remove_button = document.querySelector(".meno");
const full_screen_button = document.querySelector(".fullscreen")

let count = 0;
function increment_counter() {
  if (count == goal.textContent) {
    return;
  }

  count++;
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
