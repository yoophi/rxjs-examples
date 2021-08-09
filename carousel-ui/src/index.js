const $view = document.getElementById("carousel");
const $container = $view.querySelector(".container");
const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const SUPPORT_TOUCH = "ontouchstart" in window;
const EVENTS = {
  start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
  move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
  end: SUPPORT_TOUCH ? "touchend" : "mouseup",
};

import { fromEvent } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

const start$ = fromEvent(window, EVENTS.start);
const move$ = fromEvent(window, EVENTS.move);
const end$ = fromEvent(window, EVENTS.end);

const drag$ = start$.pipe(switchMap((start) => move$.pipe(takeUntil(end$))));

drag$.subscribe((e) => console.log(e));
