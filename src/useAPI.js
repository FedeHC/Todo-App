import { useState, useEffect } from 'react';


const useAPI = (endpoint) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(endpoint, { method: 'GET' });
      let dataJson = null;

      if (response.ok) {
        dataJson = await response.json();
        // console.log("[useAPI] dataJson:\n",dataJson);
        setData(dataJson);
      }
      else {
        console.log("# ERROR: " + response.status);
      }
    }

    getData();
  }, [endpoint]);

  // console.log("-DATA:\n", data);
  return data;
}

export default useAPI;
