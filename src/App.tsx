import axios from "axios";
import Navbar from "./components/Navbar"
import Pokedex from "./components/Pokedex";
import { useEffect, useState } from "react";

function App() {

  const pokedexURL = "https://pokeapi.co/api/v2/pokedex";

  const [pokedexes, setPokedexes] = useState<Array<any>>([]);

  useEffect(() => {
    axios.get(pokedexURL).then((response) => {
      setPokedexes(response.data.results)
    });
  }, []);

  console.log(pokedexes);
  
  return (
    <>
      <Navbar/>

      <div className="dex-list">
        {pokedexes.map((pokedex,index) => 
          <Pokedex
          name={pokedex.name}
          key={index}
          />
          )}
      </div>
    </>
  )
}

export default App
