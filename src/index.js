import { fromEvent } from "rxjs";

const keyup$ = fromEvent(document.getElementById("search"), "keyup");
keyup$.subscribe((event) =>
  console.log(`사용자 입력의 KeyboardEvent: ${event}`)
);
