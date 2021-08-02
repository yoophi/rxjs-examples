import { from, fromEvent } from "rxjs";
import { map } from "rxjs/operators";

const keyup$ = fromEvent(document.getElementById("search"), "keyup").pipe(
  map((event) => event.target.value)
);
keyup$.subscribe((event) => console.log(`#search 에 입력된 값: ${event}`));

//
const request$ = from(
  fetch(`https://api.github.com/search/users?q=yoophi`).then((res) =>
    res.json()
  )
);
request$.subscribe((json) => {
  console.log("서버에서 전달 받은 값");
  console.log({ json });
});

//
import { ajax } from "rxjs/ajax";
ajax
  .getJSON("https://api.github.com/search/users?q=yoophi")
  .subscribe((json) => {
    console.log("서버에서 전달 받은 값");
    console.log({ json });
  });
