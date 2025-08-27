// Componente SearchBar con funcionalidad completa
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Sugerencias mockup
  const mockSuggestions = [
    'iPhone 13 Pro',
    'Samsung Galaxy S21',
    'Notebook Lenovo',
    'Auriculares Bluetooth',
    'Smartwatch Apple',
    'Tablet Samsung',
    'Cámara Canon',
    'Parlante JBL',
    'Mouse Gaming',
    'Teclado Mecánico'
  ];

  // Categorías populares
  const popularCategories = [
    'Tecnología',
    'Electrodomésticos', 
    'Hogar y Muebles',
    'Deportes',
    'Moda'
  ];

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsLoading(true);
      // Simular búsqueda de sugerencias
      setTimeout(() => {
        const filtered = mockSuggestions.filter(item =>
          item.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 200);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      // Agregar al historial
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      
      // Navegar a resultados
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const removeFromHistory = (item, e) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(historyItem => historyItem !== item);
    setSearchHistory(newHistory);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* Input de búsqueda */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Search size={20} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Buscar productos, marcas y más..."
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-12 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        
        <button
          onClick={() => handleSearch()}
          className="absolute right-2 bg-primary text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Panel de sugerencias */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
          
          {/* Historial de búsqueda */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div className="p-3 border-b">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Búsquedas recientes</h4>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(item)}
                  className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded group"
                >
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                  <button
                    onClick={(e) => removeFromHistory(item, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* Categorías populares */}
          {query.length === 0 && (
            <div className="p-3 border-b">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Categorías populares</h4>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(`/category/${category.toLowerCase()}`)}
                    className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias de búsqueda */}
          {query.length > 0 && (
            <div className="p-2">
              {isLoading ? (
                <div className="p-3 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 px-2">Sugerencias</h4>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="flex items-center w-full p-2 text-left hover:bg-gray-50 rounded"
                    >
                      <Search size={16} className="text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No se encontraron sugerencias
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
