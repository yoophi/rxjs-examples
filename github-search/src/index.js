import { fromEvent } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  partition,
  tap,
} from "rxjs/operators";

const $layer = document.getElementById("suggestLayer");

const keyup$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged()
);

let [user$, reset$] = keyup$.pipe(
  partition((query) => query.trim().length > 0)
);

user$ = user$.pipe(
  tap(showLoading),
  mergeMap((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  ),
  tap(hideLoading)
);

reset$ = reset$.pipe(tap((v) => ($layer.innerHTML = "")));

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
