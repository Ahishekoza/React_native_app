import {createContext, useContext,useState,useEffect} from 'react'
import { getCurrentUser } from '../lib/appwrite'

const GlobalContext = createContext()


export const GlobalContextProvider = ({children}) =>{

    const [loading,setLoading] =  useState(false)
    const [islogged,setIsLogged] = useState(false)
    const [user,setUser] = useState(null)

    console.log("uSER",user);


    useEffect(() => {
        getCurrentUser()
          .then((res) => {
            if (res) {
              setIsLogged(true);
              setUser(res);
            } else {
              setIsLogged(false);
              setUser(null);
            }
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);

    return (
        <GlobalContext.Provider value={{user,setUser,islogged,setIsLogged,loading,setLoading}}>{children}</GlobalContext.Provider>
    )

}


export const  useGlobalContext =()=>{
    return useContext(GlobalContext)
}