import axios from "axios";
import React, { useState, useEffect } from "react";

interface TypeFilterProps {
  pokedexUrl: string;
  onSelectType: (type: string) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ pokedexUrl, onSelectType }) => {
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    const fetchPokedexDetails = async () => {
      try {
        const response = await axios.get(pokedexUrl);
        const types = response.data.types.map((type: any) => type.type.name);
        setAvailableTypes(types);
      } catch (error) {
        console.error("Error fetching Pokedex details:", error);
      }
    };

    fetchPokedexDetails();
  }, [pokedexUrl]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);
    onSelectType(selectedType);
  };

  return (
    <div className="type-filter">
      <label htmlFor="typeSelect">Select Type: </label>
      <select id="typeSelect" value={selectedType} onChange={handleTypeChange}>
        <option value="">All Types</option>
        {availableTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TypeFilter;