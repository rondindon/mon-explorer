import axios from "axios";
import Navbar from "./components/Navbar";
import Pokedex from "./components/Pokedex";
import { useEffect, useState } from "react";
import InfiniteScrollPokemon from "./components/InfiniteScrollPokemon";

function App() {
  const pokedexURL = "https://pokeapi.co/api/v2/pokedex";

  const [pokedexes, setPokedexes] = useState<Array<any>>([]);
  const [selectedPokemonPokedex, setSelectedPokemonPokedex] = useState<Array<any>>([]);
  const [isPokedexSelected, setIsPokedexSelected] = useState<boolean>(false);
  const [pokemonSearch, setPokemonSearch] = useState<string>("");

  useEffect(() => {
    axios.get(pokedexURL).then((response) => {
      setPokedexes(response.data.results);
    });
  }, []);

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

  return (
    <>
      <Navbar onTitleClick={handleTitleClick} />

      {isPokedexSelected ? (
        <div className="mons">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search Pokemon"
              value={pokemonSearch}
              onChange={(e) => setPokemonSearch(e.target.value)}
            />
          </div>

          <InfiniteScrollPokemon pokemonSearch={pokemonSearch} pokemonSpecies={filteredPokemon}/>

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
}

export default App;