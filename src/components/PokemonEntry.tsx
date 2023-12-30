import React, { useState } from 'react';

interface PokemonEntryProps {
  entryNumber: number;
  speciesName: string;
  speciesUrl: string;
}

const PokemonEntry: React.FC<PokemonEntryProps> = ({ entryNumber, speciesName, speciesUrl }) => {

    const [isShiny, setIsShiny] = useState<boolean>(false);

    const getPokemonNumber = (url: string): string => {
        const matches = url.match(/\/(\d+)\/$/);
        return matches && matches.length === 2 ? matches[1] : '';
    };

  return (
    <div className="pokemon">
      <h1 className='mon-entry'>Pokédex entry : <strong>{entryNumber}</strong></h1>
      <h2 className='mon-name'>{speciesName}</h2>
      <img
        className='mon-img'
        src={isShiny
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${getPokemonNumber(speciesUrl)}.png`
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonNumber(speciesUrl)}.png`}
        alt={speciesName}
        onClick={() => {setIsShiny(!isShiny)}}
      />
    </div>
  );
};

export default PokemonEntry;