import { useState, useEffect } from 'react';


const useAPI = (endpoint) => {
  const [ data, setData ] = useState([]);

  const getData = async () => {
    const response = await fetch(endpoint);
    let dataJson = null;

    if(response.ok) {
      dataJson = await response.json();
      // console.log(dataJson);
      setData(dataJson);
    }
    else {
      console.log("# ERROR: " + response.status);
    }
  }
  
  useEffect(()=> {
    getData();
  },[]);

  // console.log("-DATA:\n", data);
  return data;
}

export default useAPI;
