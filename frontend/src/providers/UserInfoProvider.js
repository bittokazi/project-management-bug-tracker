import React, { useState } from "react";

export const UserInfoContext = React.createContext(null);

export default function UserInfoProvider(props) {
  const [user, setUser] = useState(null);

  return (
    <UserInfoContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {props.children}
    </UserInfoContext.Provider>
  );
}
