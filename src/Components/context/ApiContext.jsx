import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [refresh, setRefresh] = useState(false);
  const [jbl, setJbl] = useState([]);
  const [users,setusers ] = useState([]);

  const Saveduser = localStorage.getItem("user");
  const userData = Saveduser ? JSON.parse(Saveduser) : null;
  const [user, setUser] = useState(userData || { cart: [] });


  useEffect(() => {
    axios
      .get("http://localhost:5001/jbl")
      .then((res) => setJbl(res.data))
      .catch(() => console.error("Error fetching JBL products"));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:5001/user")
      .then((res) => setusers(res.data))
      .catch(() => console.error("Error fetching users"));
  }, [refresh]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/user/${userData.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (userData?.id) fetchUser();
  }, [refresh]);

  return (
    <ApiContext.Provider value={{ jbl, user, setRefresh, refresh,users }}>
      {children}
    </ApiContext.Provider>
  );
}


