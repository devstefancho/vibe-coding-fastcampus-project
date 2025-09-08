import React, { useState } from 'react';
import { getAvailableCities } from '../services/weatherService';

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const availableCities = getAvailableCities();

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setQuery(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="도시명을 입력하세요 (예: 서울, 부산, 제주도)"
            className="search-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()} className="search-button">
            {loading ? '검색중...' : '🔍'}
          </button>
        </div>
        
        {showSuggestions && query && filteredCities.length > 0 && (
          <div className="suggestions">
            {filteredCities.map(city => (
              <div
                key={city}
                className="suggestion-item"
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;