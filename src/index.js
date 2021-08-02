import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  map,
  mergeMap,
  debounceTime,
  filter,
  distinctUntilChanged,
} from "rxjs/operators";

const user$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(),
  filter((query) => query.trim().length > 0),
  mergeMap((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  )
);

user$.subscribe((value) => {
  console.log("서버로부터 받은 검색 결과", value);
});
