import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
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
import { SearchInput } from "./SearchInput";
import { UserProfile } from "./UserProfile";

export const App = () => {
  const inputRef = useRef();
  const [usersData, setUsersData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const keyup$ = fromEvent(inputRef.current, "keyup").pipe(
      debounceTime(300),
      map((event) => event.target.value),
      distinctUntilChanged()
    );
    let [user$, reset$] = keyup$.pipe(
      partition((query) => query.trim().length > 0)
    );
    user$ = user$.pipe(
      tap(() => {
        setIsLoading(true);
      }),
      mergeMap((query) =>
        ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
      ),
      tap(() => {
        setIsLoading(false);
      })
    );
    user$.subscribe((value) => setUsersData(value));
    reset$ = reset$.pipe(tap(() => setUsersData({})));
    reset$.subscribe();
  }, [inputRef, setIsLoading, setUsersData]);

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
      <div id="loading" style={{ display: isLoading ? "block" : "none" }}>
        <FontAwesomeIcon icon={faSpinner} />
      </div>
    </div>
  );
};
