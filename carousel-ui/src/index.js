const $view = document.getElementById("carousel");
const $container = $view.querySelector(".container");
const PANEL_COUNT = $container.querySelectorAll(".panel").length;

const THRESHOLD = 30;
const DEFAULT_DURATION = 300;
const SUPPORT_TOUCH = "ontouchstart" in window;
const EVENTS = {
  start: SUPPORT_TOUCH ? "touchstart" : "mousedown",
  move: SUPPORT_TOUCH ? "touchmove" : "mousemove",
  end: SUPPORT_TOUCH ? "touchend" : "mouseup",
};

import {
  concat,
  defer,
  fromEvent,
  merge,
  animationFrameScheduler,
  interval,
  of,
} from "rxjs";
import {
  first,
  map,
  mergeAll,
  scan,
  share,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
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
  share(),
  map((distance) => ({ distance }))
);
const drop$ = drag$.pipe(
  switchMap((drag) =>
    end$.pipe(
      map((event) => drag),
      first()
    )
  ),
  withLatestFrom(size$, (drag, size) => {
    return { ...drag, size };
  })
);

const carousel$ = merge(drag$, drop$).pipe(
  scan(
    (store, { distance, size }) => {
      const updateStore = {
        from: -(store.index * store.size) + distance,
      };

      if (size === undefined) {
        updateStore.to = updateStore.from;
      } else {
        let tobeIndex = store.index;
        if (Math.abs(distance) >= THRESHOLD) {
          tobeIndex =
            distance < 0
              ? Math.min(tobeIndex + 1, PANEL_COUNT - 1)
              : Math.max(tobeIndex - 1, 0);
        }
        updateStore.index = tobeIndex;
        updateStore.to = -(tobeIndex * size);
        updateStore.size = size;
      }
      return { ...store, ...updateStore };
    },
    {
      from: 0,
      to: 0,
      index: 0,
      size: 0,
    }
  ),
  switchMap(({ from, to }) =>
    from === to ? of(to) : animation(from, to, DEFAULT_DURATION)
  )
);

function translateX(posX) {
  $container.style.transform = `translate3d(${posX}px, 0, 0)`;
}
carousel$.subscribe((pos) => {
  console.log("carousel", pos);
  translateX(pos);
});

function animation(from, to, duration) {
  return defer(() => {
    const scheduler = animationFrameScheduler;
    const start = scheduler.now();
    const interval$ = interval(0, scheduler).pipe(
      map(() => (scheduler.now() - start) / duration),
      takeWhile((rate) => rate < 1)
    );
    return concat(interval$, of(1)).pipe(
      map((rate) => from + (to - from) * rate)
    );
  });
}
