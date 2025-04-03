import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); 
  const [shareId,setShareId]= useState('')

  return (
    <UserContext.Provider value={{ userId, setUserId , shareId, setShareId}}>
      {children}
    </UserContext.Provider>
  );
};
