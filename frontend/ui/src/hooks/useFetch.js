import { useState, useEffect } from 'react';

// /**
//  * Custom hook for making API requests
//  * 
//  * @param {string} url - API endpoint to fetch from
//  * @param {Object} options - Fetch options (method, headers, body, etc.)
//  * @param {boolean} immediate - Whether to fetch immediately when component mounts
//  * @returns {Object} - data, error, loading state, and refetch function
//  */
const useFetch = (url, options = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (customUrl = url, customOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchUrl = customUrl || url;
      const fetchOptions = { ...options, ...customOptions };
      
      const response = await fetch(fetchUrl, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
      }
      
      const jsonData = await response.json();
      setData(jsonData);
      return jsonData;
      
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate]);

  return { data, error, loading, refetch: fetchData };
};

export default useFetch;