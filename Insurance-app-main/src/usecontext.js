import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [update, setUpdate] = useState(true)
  const [refreshFromUpdate,setRefreshFromUpdate]=useState(true);
  const [refreshFromCreate, setRefreshFromCreate]=useState(true);
  const[refreshCreateFromAdmin,setRefreshCreateFromAdmin]=useState(true);

  return (
    <UserContext.Provider value={{ userId, setUserId , update, setUpdate, refreshFromUpdate, setRefreshFromUpdate, refreshFromCreate, setRefreshFromCreate, refreshCreateFromAdmin, setRefreshCreateFromAdmin}}>
      {children}
    </UserContext.Provider>
  );
};
