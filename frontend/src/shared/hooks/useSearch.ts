import { useState, useEffect } from 'react';

export function useSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    debouncedTerm,
    setSearchTerm,
    clearSearch,
  };
}
