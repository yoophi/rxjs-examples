const $view = document.getElementById('carousel')
const $container = $view.querySelector('.container')
const PANEL_COUNT = $container.querySelectorAll('.panel').length;

const SUPPORT_TOUCH = "ontouchstart" in window;
const EVENTS = {
  start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
  move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
  end: SUPPORT_TOUCH ? "touchend" : "mouseup",
};

import { fromEvent } from "rxjs";

const start$ = fromEvent(window, EVENTS.start);
const move$ = fromEvent(window, EVENTS.move);
const end$ = fromEvent(window, EVENTS.end);

start$.subscribe(() => console.log("start"));
move$.subscribe(() => console.log("move"));
end$.subscribe(() => console.log("end"));
