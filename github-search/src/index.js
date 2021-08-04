import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  tap,
} from "rxjs/operators";

const $layer = document.getElementById("suggestLayer");

const keyup$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged()
);

const user$ = keyup$.pipe(
  filter((query) => query.trim().length > 0),
  tap(showLoading),
  mergeMap((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  ),
  tap(hideLoading)
);

const reset$ = keyup$.pipe(
  filter((query) => query.trim().length === 0),
  tap((v) => ($layer.innerHTML = ""))
);

user$.subscribe();
reset$.subscribe();

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

const $loading = document.getElementById("loading");

function showLoading() {
  $loading.style.display = "block";
}

function hideLoading() {
  $loading.style.display = "none";
}
