import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [update, setUpdate] = useState(true)
  const [refreshFromUpdate,setRefreshFromUpdate]=useState(true);
  return (
    <UserContext.Provider value={{ userId, setUserId , update, setUpdate, refreshFromUpdate, setRefreshFromUpdate}}>
      {children}
    </UserContext.Provider>
  );
};
