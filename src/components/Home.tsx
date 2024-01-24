import axios from "axios";
import Navbar from "./Navbar";
import Pokedex from "./Pokedex";
import { useEffect, useState } from "react";
import InfiniteScrollPokemon from "./InfiniteScrollPokemon";

function App() {
  const pokedexURL = "https://pokeapi.co/api/v2/pokedex";

  const [pokedexes, setPokedexes] = useState<Array<any>>([]);
  const [selectedPokemonPokedex, setSelectedPokemonPokedex] = useState<Array<any>>([]);
  const [isPokedexSelected, setIsPokedexSelected] = useState<boolean>(false);
  const [pokemonSearch, setPokemonSearch] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>('entryNumber'); // 'name', 'entryNumber', 'type', 'weight', etc.
  const [sortOrder, setSortOrder] = useState<string>('asc'); // 'asc' or 'desc'
  const [suggestedResults, setSuggestedResults] = useState<Array<any>>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedSearch = localStorage.getItem("pokemonSearch");
    if (savedSearch) {
      setPokemonSearch(savedSearch);
    }

    axios.get(pokedexURL).then((response) => {
      setPokedexes(response.data.results);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("pokemonSearch", pokemonSearch);
  }, [pokemonSearch]);

  const handleSuggestionClick = (suggestion : string) => {
    setPokemonSearch(suggestion);
  };

  const handlePokedexClick = async (url: string) => {
    try {
      setIsPokedexSelected(true);
      const response = await axios.get(url);
      setSelectedPokemonPokedex(response.data.pokemon_entries);
      scrollToTop(); // Scroll to top when Pokedex is selected
    } catch (error) {
      console.error("Error fetching Pokedex details:", error);
    }
  };

  const handleTitleClick = () => {
    setIsPokedexSelected(false);
    setPokemonSearch("");
    setSelectedPokemonPokedex([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredPokemon = selectedPokemonPokedex.filter((pokemon) => {
    const entryNumberString = `${pokemon.entry_number}`;
    const isNameMatch = pokemon.pokemon_species.name.toLowerCase().includes(pokemonSearch.toLowerCase());
    const isEntryNumberMatch = entryNumberString === pokemonSearch;
    return isNameMatch || isEntryNumberMatch;
  });

  const getSortedPokemon = () => {
    switch (sortCriteria) {
      case 'name':
        return sortOrder === 'asc'
          ? [...filteredPokemon].sort((a, b) => a.pokemon_species.name.localeCompare(b.pokemon_species.name))
          : [...filteredPokemon].sort((a, b) => b.pokemon_species.name.localeCompare(a.pokemon_species.name));
      case 'entryNumber':
        return sortOrder === 'asc'
          ? [...filteredPokemon].sort((a, b) => a.entry_number - b.entry_number)
          : [...filteredPokemon].sort((a, b) => b.entry_number - a.entry_number);
      // Add cases for other criteria (type, weight, etc.)
      default:
        return [...filteredPokemon];
    }
  };
  
  const sortedPokemon = getSortedPokemon();

  useEffect(() => {
    setSuggestedResults([]);
    if (pokemonSearch.trim() !== '' && suggestedResults.length === 0 && pokemonSearch.length > 1) {
      setSuggestedResults(sortedPokemon.slice(0, 5));
    } else {
      setSuggestedResults([]);
    }
  }, [pokemonSearch]);

  return (

      <>
        <Navbar onTitleClick={handleTitleClick} />

        {isPokedexSelected ? (
          <div className="mons">
            <div className="search-bar">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search Pokemon or Entry Number"
                  value={pokemonSearch}
                  onChange={(e) => setPokemonSearch(e.target.value)}
                />
                {suggestedResults.length > 0 && (
                <ul className="suggested-results">
                  {suggestedResults.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion.pokemon_species.name)}>
                      {suggestion.pokemon_species.name}
                    </li>
                  ))}
                </ul>
                )}
              </div>
              <div className="categories">
                <div className="select">
                  <label className="sort-label" htmlFor="sortCriteria">Sort by: </label>
                    <select
                      className="sort-select"
                      defaultValue={sortCriteria}
                      id="sortCriteria"
                      onChange={(e) => setSortCriteria(e.target.value)}
                    >
                      <option value="entryNumber">Entry Number</option>
                      <option value="name">Name</option>
                      
                      {/* Add additional sorting criteria options as needed */}
                    </select>
                  </div>

                  <button 
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="sort-order-button"
                  >{sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
              </div>

            </div>

            <InfiniteScrollPokemon pokemonSearch={pokemonSearch} pokemonSpecies={sortedPokemon} sortOrder={sortOrder} sortCriteria={sortCriteria}/>

          </div>
        ) : (
          <div className="dex-list">
            {pokedexes.map((pokedex, index) => (
              <Pokedex
                name={pokedex.name}
                key={index}
                onClick={() => handlePokedexClick(pokedex.url)}
              />
            ))}
          </div>
        )}

        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      </>
  );
};

export default App;