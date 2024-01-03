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
  sortCriteria: string;
  sortOrder: string;
}

const InfiniteScrollPokemon: React.FC<ScrollProps> = ({ pokemonSearch, pokemonSpecies, sortCriteria, sortOrder }) => {
  const [pokemonData, setPokemonData] = useState<PokemonSpecies[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const limit = 30;

  useEffect(() => {
    fetchData();
  }, [pokemonSpecies,pokemonSearch]); // Load initial data and when pokemonSpecies changes

  const fetchMoreData = () => {
    const newData = pokemonSpecies.slice(offset, offset + limit);
    setPokemonData((prevData) => [...prevData, ...newData]);
    setOffset((prevOffset) => prevOffset + limit);
  };

  const fetchData = () => {
    const newData = pokemonSpecies.slice(0, limit);
    setPokemonData(newData);
    setOffset(limit);
  };

  const handleRandomizeClick = () => {
    const randomizedArray = [...pokemonSpecies].sort(() => Math.random() - 0.5);
    setPokemonData(randomizedArray.slice(0, 50)); // Display the first 'offset' elements
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
    <div className="randomize">
      <button data-front='Surprise me :)' data-back="Go" className='randomize-btn' onClick={handleRandomizeClick}></button>
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
                      sortCriteria={sortCriteria}
                      sortOrder={sortOrder}
                      />
                  ))}
                  
              </>
        ) : (
          
          <p>No matching Pokemon found for the given search term.</p>

        )}
      </div>
    </div>
  );
};

export default InfiniteScrollPokemon;