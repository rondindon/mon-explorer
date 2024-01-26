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
  const [loading, setLoading] = useState<boolean>(false);
  const [randomizeButtonDisabled, setRandomizeButtonDisabled] = useState(false);
  const [infiniteScrollActive, setInfiniteScrollActive] = useState<boolean>(true);
  const limit = 20;

  useEffect(() => {
    setInfiniteScrollActive(true);
    fetchData();
  }, [pokemonSpecies]); // Load initial data and when pokemonSpecies changes

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
    setInfiniteScrollActive(false);
    setLoading(true);
    const randomizedArray = [...pokemonSpecies].sort(() => Math.random() - 0.5);
    const firstFiftyPokemon = randomizedArray.slice(0, 48);
    setPokemonData(firstFiftyPokemon);
    setLoading(false);
    setRandomizeButtonDisabled(true);
  
    setTimeout(() => {
      setRandomizeButtonDisabled(false)
      
    }, 300);
  };

  console.log(offset);

  useEffect(() => {
    setInfiniteScrollActive(true);
  }, [sortCriteria,sortOrder])
  
  useEffect(() => {
    const handleScroll = () => {
      if (!infiniteScrollActive) {
        return;
      }
    
      const scrollTop = Math.ceil(document.documentElement.scrollTop);
      const windowHeight = window.innerHeight;
      const offsetHeight = document.documentElement.offsetHeight;

      console.log(scrollTop, windowHeight, offsetHeight);
    
      if (scrollTop >= offsetHeight - windowHeight) {
        fetchMoreData();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [offset, infiniteScrollActive]);

  return (
    <div className="randomize">
      <button data-front='Surprise me :)' data-back="Go" className='randomize-btn' onClick={handleRandomizeClick} disabled={randomizeButtonDisabled}></button>
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
      ) : loading ? (

        <p>Loading...</p>

      ) : (
        
        <p>No matching Pokemon found for the given search term.</p>
        
      )}
      </div>
    </div>
  );
};

export default InfiniteScrollPokemon;