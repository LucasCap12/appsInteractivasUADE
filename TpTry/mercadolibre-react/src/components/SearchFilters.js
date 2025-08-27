// Componente para filtros de búsqueda
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

const SearchFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    condition: true,
    location: false,
    features: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      price: {
        ...filters.price,
        [field]: value
      }
    });
  };

  const handleCheckboxChange = (category, value, checked) => {
    const currentValues = filters[category] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(item => item !== value);
    }
    
    onFiltersChange({
      ...filters,
      [category]: newValues
    });
  };

  const priceRanges = [
    { label: 'Hasta $10.000', min: 0, max: 10000 },
    { label: '$10.000 a $25.000', min: 10000, max: 25000 },
    { label: '$25.000 a $50.000', min: 25000, max: 50000 },
    { label: '$50.000 a $100.000', min: 50000, max: 100000 },
    { label: 'Más de $100.000', min: 100000, max: null }
  ];

  const brands = [
    'Samsung', 'Apple', 'Xiaomi', 'Motorola', 'LG', 
    'Sony', 'Huawei', 'Nokia', 'OnePlus', 'Google'
  ];

  const conditions = [
    { value: 'new', label: 'Nuevo' },
    { value: 'used', label: 'Usado' },
    { value: 'refurbished', label: 'Reacondicionado' }
  ];

  const locations = [
    'Capital Federal', 'Buenos Aires', 'Córdoba', 
    'Rosario', 'Mendoza', 'Tucumán'
  ];

  const features = [
    { value: 'freeShipping', label: 'Envío gratis' },
    { value: 'fullRefund', label: 'Devolución gratis' },
    { value: 'bestSeller', label: 'Más vendido' },
    { value: 'officialStore', label: 'Tienda oficial' }
  ];

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.values(value).some(v => v);
    return Boolean(value);
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter size={20} className="text-gray-600 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-primary hover:text-blue-600"
          >
            <X size={16} className="mr-1" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.brands?.map(brand => (
              <span
                key={brand}
                className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs rounded-full"
              >
                {brand}
                <button
                  onClick={() => handleCheckboxChange('brands', brand, false)}
                  className="ml-1 hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {filters.condition?.map(condition => (
              <span
                key={condition}
                className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs rounded-full"
              >
                {conditions.find(c => c.value === condition)?.label}
                <button
                  onClick={() => handleCheckboxChange('condition', condition, false)}
                  className="ml-1 hover:text-gray-200"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Precio */}
      <FilterSection title="Precio" sectionKey="price">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filters.price?.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filters.price?.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  className="text-primary focus:ring-primary"
                  onChange={() => handlePriceChange('min', range.min) && handlePriceChange('max', range.max)}
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca" sectionKey="brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brands?.includes(brand) || false}
                onChange={(e) => handleCheckboxChange('brands', brand, e.target.checked)}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Condición */}
      <FilterSection title="Condición" sectionKey="condition">
        <div className="space-y-2">
          {conditions.map(condition => (
            <label key={condition.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.condition?.includes(condition.value) || false}
                onChange={(e) => handleCheckboxChange('condition', condition.value, e.target.checked)}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{condition.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Ubicación */}
      <FilterSection title="Ubicación" sectionKey="location">
        <div className="space-y-2">
          {locations.map(location => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.locations?.includes(location) || false}
                onChange={(e) => handleCheckboxChange('locations', location, e.target.checked)}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Características */}
      <FilterSection title="Características" sectionKey="features">
        <div className="space-y-2">
          {features.map(feature => (
            <label key={feature.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.features?.includes(feature.value) || false}
                onChange={(e) => handleCheckboxChange('features', feature.value, e.target.checked)}
                className="text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default SearchFilters;
