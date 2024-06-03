import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useAppwrite = (fn)=>{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fn();
        setData(res);
        setLoading(false);
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);


    const refetch = () => fetchData();
    return {data, loading, refetch}

}