import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface PokemonEntryProps {
  entryNumber: number;
  speciesName: string;
  speciesUrl: string;
  pokemonSearch: string;
}

const PokemonEntry: React.FC<PokemonEntryProps> = ({ entryNumber, speciesName, speciesUrl, pokemonSearch }) => {
    const [isShinyAvailable, setIsShinyAvailable] = useState<boolean>(false);
    const [isShiny, setIsShiny] = useState<boolean>(false);
    const [types, setTypes] = useState<string[]>([]);

    const getPokemonNumber = (url: string): string => {
        const matches = url.match(/\/(\d+)\/$/);
        return matches && matches.length === 2 ? matches[1] : '';
    };

    const shinyImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${getPokemonNumber(speciesUrl)}.png`;
    const regularImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonNumber(speciesUrl)}.png`;

    const handleIsShinyClick = () => {
      // Toggle isShiny only if shiny is available
      if (isShinyAvailable) {
        setIsShiny((prevIsShiny) => !prevIsShiny);
      }
    };

    useEffect(() => {
      const fetchPokemonDetails = async () => {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${entryNumber}`);
          const pokemonTypes = response.data.types.map((type: any) => type.type.name);
          setTypes(pokemonTypes);
        } catch (error) {
          console.error('Error fetching Pokemon details:', error);
        }
      };
  
      fetchPokemonDetails();
    }, [entryNumber]);

    useEffect(() => {
      const checkShinyAvailability = async () => {
        try {
          await axios.get(shinyImageUrl);
          // Shiny image exists, set isShinyAvailable to true
          setIsShinyAvailable(true);
        } catch (error) {
          // Shiny image doesn't exist, set isShinyAvailable to false
          setIsShinyAvailable(false);
        }
        setIsShiny(false);
      };
    
      checkShinyAvailability();
    }, [shinyImageUrl,pokemonSearch]);

  return (
    <div className="pokemon">
      <h1 className='mon-entry'>Pokédex entry : <strong>{entryNumber}</strong></h1>
      <h2 className='mon-name'>{speciesName}</h2>
      <div className="mon-types">
        {types.map((type, index) => (
          <img 
          key={index} 
          className={`mon-type ${type.toLowerCase()}`}
          src={`/src/assets/types/${type.toLowerCase()}.webp`}
          />
        ))}
      </div>
      <img
        className='mon-img'
        src={isShiny ? shinyImageUrl : regularImageUrl}
        alt={speciesName}
        onClick={handleIsShinyClick}
      />
    </div>
  );
};

export default PokemonEntry;