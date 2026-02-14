// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import BASE_URL from '../../config/baseUrl';

// export const ApiContext = createContext();

// export function ApiProvider({ children }) {
//   const [refresh, setRefresh] = useState(false);
//   const [jbl, setJbl] = useState([]);
//   const [users,setusers ] = useState([]);

//   const Saveduser = localStorage.getItem("user");
//   let userData = null;
//   // try {
//   //   userData = Saveduser ? JSON.parse(Saveduser) : null;
//   // } catch (error) {
//   //   console.error("Error parsing user data from localStorage:", error);
//   // }
//   const [user, setUser] = useState(userData || { cart: [] });
//   // Use the imported BASE_URL from the config file

//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/users/allproducts`)
//       .then((res) => setJbl(res.data))
//       .catch(() => console.error("Error fetching JBL products"));
//   }, []);
//   useEffect(() => {
//     axios
//       .get(`${BASE_URL}/users`)
//       .then((res) => setusers(res.data))
//       .catch(() => console.error("Error fetching users"));
//   }, [refresh]);


//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userData?.id) {
//         console.warn("User ID is undefined or null. Skipping fetchUser call.");
//         return;
//       }

//       try {
//         const res = await axios.get(`${BASE_URL}/user/${userData.id}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       }
//     };

//     fetchUser();
//   }, [refresh]);

//   return (
//     <ApiContext.Provider value={{ jbl, user, setRefresh, refresh,users }}>
//       {children}
//     </ApiContext.Provider>
//   );
// }


import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config/baseUrl";

export const ApiContext = createContext();

export function ApiProvider({ children }) {
  const [refresh, setRefresh] = useState(false);


  const [jbl, setJbl] = useState([]);

  // optional users list (admin usage maybe)
  const [users, setUsers] = useState([]);

  /* =========================
        FETCH PRODUCTS
     ========================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/allproducts`);

        console.log("PRODUCT API RESPONSE:", res.data);

        setJbl(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setJbl([]); // fallback
      }
    };

    fetchProducts();
  }, []);

  /* =========================
        FETCH USERS
     ========================= */
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get(`${BASE_URL}/users`);
  //       setUsers(res?.data?.data || []);
  //     } catch (err) {
  //       console.error("Error fetching users:", err);
  //     }
  //   };

  //   fetchUsers();
  // }, [refresh]);

  return (
    <ApiContext.Provider
      value={{
        jbl,        
        users,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
