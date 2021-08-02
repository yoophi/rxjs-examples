import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

const keyup$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  map((event) => event.target.value)
);
keyup$.subscribe((event) => console.log(`#search 에 입력된 값: ${event}`));
