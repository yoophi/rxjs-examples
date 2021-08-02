import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import { map, mergeMap } from "rxjs/operators";

const user$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  map((event) => event.target.value),
  mergeMap((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  )
);

user$.subscribe((value) => {
  console.log("서버로부터 받은 검색 결과", value);
});
