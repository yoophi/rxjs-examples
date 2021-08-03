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

const $layer = document.getElementById("suggestLayer");

function drawLayer(items) {
  $layer.innerHTML = items
    .map((user) => {
      return `
      <li class="user">
      <img src="${user.avatar_url}" width="50px" height="50px" />
      <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
      </li>
      `;
    })
    .join("");
}

user$.subscribe((v) => drawLayer(v.items));
