import React, { useEffect, useRef, useState } from "react";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  mergeMap,
} from "rxjs";
import { ajax } from "rxjs/ajax";
import { SearchInput } from "./SearchInput";
import { UserProfile } from "./UserProfile";

export const App = () => {
  const inputRef = useRef();
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const user$ = fromEvent(inputRef.current, "keyup").pipe(
      debounceTime(300),
      map((event) => event.target.value),
      distinctUntilChanged(),
      filter((query) => query.trim().length > 0),
      mergeMap((query) =>
        ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
      )
    );
    user$.subscribe((value) => setUsersData(value));
  }, [inputRef]);

  return (
    <div className="autocomplete">
      <SearchInput inputRef={inputRef} />
      {usersData.items && (
        <ul id="suggestLayer">
          {usersData.items.map((user) => (
            <UserProfile key={user.id} user={user} />
          ))}
        </ul>
      )}
    </div>
  );
};
