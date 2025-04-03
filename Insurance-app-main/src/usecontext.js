import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); 
  const [email,setEmail]=useState('');
  const [shareEmail,setShareEmail]= useState('')

  return (
    <UserContext.Provider value={{ userId, setUserId , email, setEmail, shareEmail, setShareEmail}}>
      {children}
    </UserContext.Provider>
  );
};
