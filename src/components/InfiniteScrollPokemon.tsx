import React, { useState, useEffect } from 'react';
import PokemonEntry from './PokemonEntry';

interface PokemonSpecies {
  entry_number: number;
  pokemon_species: {
    name: string;
    url: string;
  };
}

interface ScrollProps {
  pokemonSearch: string;
  pokemonSpecies: PokemonSpecies[];
}

const InfiniteScrollPokemon: React.FC<ScrollProps> = ({ pokemonSearch, pokemonSpecies }) => {
  const [pokemonData, setPokemonData] = useState<PokemonSpecies[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const limit = 30;

  useEffect(() => {
    fetchData();
  }, [pokemonSpecies]); // Load initial data and when pokemonSpecies changes

  useEffect(() => {
    console.log(pokemonSearch);
  }, [pokemonSearch]);

  const fetchMoreData = () => {
    console.log('xd',offset)
    const newData = pokemonSpecies.slice(offset, offset + limit);
    setPokemonData((prevData) => [...prevData, ...newData]);
    setOffset((prevOffset) => prevOffset + limit);
  };

  const fetchData = () => {
    console.log(offset);
    console.log("dsd")
    const newData = pokemonSpecies.slice(0, limit);
    setPokemonData(newData);
    setOffset(limit);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        fetchMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset, pokemonSpecies]);

  return (
    <div className="mon-list">
        {pokemonData.length > 0 ? (
            <>
            
                {pokemonData.map((pokemon, index) => (
                    <PokemonEntry
                    key={index}
                    entryNumber={pokemon.entry_number}
                    speciesName={pokemon.pokemon_species.name}
                    speciesUrl={pokemon.pokemon_species.url}
                    pokemonSearch={pokemonSearch}
                    />
                ))}
                
            </>
      ) : (
        
        <p>No matching Pokemon found for the given search term.</p>

      )}
    </div>
  );
};

export default InfiniteScrollPokemon;