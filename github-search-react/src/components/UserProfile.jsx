import React from "react";

export const UserProfile = ({ user }) => {
  return (
    <li className="user">
      <img src={user.avatar_url} width="50px" height="50px" />
      <p>
        <a href={user.html_url} target="_blank">
          {user.login}
        </a>
      </p>
    </li>
  );
};
