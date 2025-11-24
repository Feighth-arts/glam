"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const CacheContext = createContext();

export function CacheProvider({ children }) {
  const [cache, setCache] = useState({});

  const getCached = useCallback((key) => {
    const item = cache[key];
    if (!item) return null;
    
    // Cache expires after 5 minutes
    if (Date.now() - item.timestamp > 5 * 60 * 1000) {
      return null;
    }
    
    return item.data;
  }, [cache]);

  const setCacheData = useCallback((key, data) => {
    setCache(prev => ({
      ...prev,
      [key]: { data, timestamp: Date.now() }
    }));
  }, []);

  const clearCache = useCallback((key) => {
    if (key) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[key];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  return (
    <CacheContext.Provider value={{ getCached, setCache: setCacheData, clearCache }}>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = () => useContext(CacheContext);
