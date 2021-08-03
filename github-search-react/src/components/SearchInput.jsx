import React, { useRef, useEffect } from "react";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  mergeMap,
} from "rxjs";
import { ajax } from "rxjs/ajax";

export const SearchInput = ({ setUserStream }) => {
  const searchInput = useRef();
  useEffect(() => {
    const user$ = fromEvent(searchInput.current, "keyup").pipe(
      debounceTime(300),
      map((event) => event.target.value),
      distinctUntilChanged(),
      filter((query) => query.trim().length > 0),
      mergeMap((query) =>
        ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
      )
    );
    setUserStream(user$);
  }, [searchInput]);

  return <input id="search" type="text" ref={searchInput} />;
};
