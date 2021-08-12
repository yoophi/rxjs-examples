const $view = document.getElementById("carousel");
const $container = $view.querySelector(".container");
const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const SUPPORT_TOUCH = "ontouchstart" in window;
const EVENTS = {
  start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
  move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
  end: SUPPORT_TOUCH ? "touchend" : "mouseup",
};

import { fromEvent, merge } from "rxjs";
import {
  first,
  map,
  share,
  startWith,
  switchMap,
  tap,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";

function toPos(obs$) {
  return obs$.pipe(
    map((v) => (SUPPORT_TOUCH ? v.changedTouches[0].pageX : v.pageX))
  );
}

const start$ = fromEvent(window, EVENTS.start).pipe(toPos);
const move$ = fromEvent(window, EVENTS.move).pipe(toPos);
const end$ = fromEvent(window, EVENTS.end);
const size$ = fromEvent(window, "resize").pipe(
  startWith(0),
  map((event) => $view.clientWidth)
);
const drag$ = start$.pipe(
  switchMap((start) =>
    move$.pipe(
      map((move) => move - start),
      takeUntil(end$)
    )
  ),
  share()
);
const drop$ = drag$.pipe(
  switchMap((drag) =>
    end$.pipe(
      map((event) => drag),
      first()
    )
  ),
  withLatestFrom(size$)
);

const carousel$ = merge(drag$, drop$);
carousel$.subscribe((v) => console.log("carousel", v));
