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