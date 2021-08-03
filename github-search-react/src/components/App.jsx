import React, { useState, useEffect } from "react";
import { SearchInput } from "./SearchInput";
import { UserProfile } from "./UserProfile";

export const App = () => {
  const [user$, setUserStream] = useState(null);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    if (user$) {
      user$.subscribe((value) => setUsersData(value));
    }
  }, [user$]);

  return (
    <div className="autocomplete">
      <SearchInput setUserStream={setUserStream} />
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
