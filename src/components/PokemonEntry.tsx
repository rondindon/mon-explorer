import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Modal from './Modal';

interface PokemonEntryProps {
  entryNumber: number;
  speciesName: string;
  speciesUrl: string;
  pokemonSearch: string;
  sortCriteria: string;
  sortOrder: string;
}

interface Form {
  id: number;
  isShiny: boolean;
  imageUrl: string;
  types: string[];
}

const PokemonEntry: React.FC<PokemonEntryProps> = ({ entryNumber, speciesName, speciesUrl, pokemonSearch, sortCriteria, sortOrder }) => {
  const [isShinyAvailable, setIsShinyAvailable] = useState<boolean>(false);
  const [isShiny, setIsShiny] = useState<boolean>(false);

  const [types, setTypes] = useState<string[]>([]);
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [exactEntryNumber, setExactEntryNumber] = useState<number | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [exactPokemonName,setExactPokemonName] = useState<string>('');

  const [isCardVisible, setIsCardVisible] = useState(false);

  const [evolutionChain, setEvolutionChain] = useState<any>(null);
  const [showEvolutionModal, setShowEvolutionModal] = useState(false);

  const pokemonId = Number(speciesUrl.match(/\/(\d+)\/$/)?.[1]);
  const shinyImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${selectedForm?.id.toString()}.png`;
  const regularImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  useEffect(() => {
    setShowEvolutionModal(false)
    setIsShiny(false);
  }, [pokemonSearch,sortOrder,sortCriteria,speciesName]);

  useEffect(() => {

    const cardVisibilityTimeout = setTimeout(() => {
      setIsCardVisible(true);
    }, 350);

    return () => {
      clearTimeout(cardVisibilityTimeout);
    };
  }, [sortCriteria, sortOrder, pokemonId]);

  useEffect(() => {
    setIsCardVisible(false);
    const fetchPokemonDetails = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonTypes = response.data.types.map((type: any) => type.type.name);
        setTypes(pokemonTypes);

        const weightKG = Number((response.data.weight * 0.1).toFixed(2));
        const heightM = Number((response.data.height * 0.1).toFixed(3));

        setExactEntryNumber(entryNumber);
        setWeight(weightKG);
        setHeight(heightM);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    };

    const fetchForms = async () => {  
      try {
        const responseForms = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        setExactPokemonName(responseForms.data.name);
        const varieties = responseForms.data.varieties;
        
        const defaultForm: Form = {
          id: pokemonId,
          isShiny: false,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
          types: [],
        };

        if (varieties && varieties.length > 1) {
          const formList: Form[] = [
            defaultForm,
            ...varieties
              .filter((variety: any) => !variety.is_default)
              .map((variety: any) => {
                const formId = variety.pokemon.url.split('/').slice(-2, -1)[0];
                const formImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`;
                
                const form: Form = {
                  id: parseInt(formId, 10),
                  isShiny: false,
                  imageUrl: formImageUrl,
                  types: [],
                };
                return form;
              }),
          ];

          // Fetch type information for each form
          await Promise.all(
            formList.map(async (form) => {
              const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${form.id}`);
              form.types = response.data.types.map((type: any) => type.type.name);
            })
          );

          setForms(formList);
          setSelectedForm(formList[0]); // Set the default selected form
        } else {
          setForms([defaultForm]);
          setSelectedForm(defaultForm);
        }
      } catch (error) {
        console.error('Error fetching Pokemon forms:', error);
      }
    };

    const checkShinyAvailability = async () => {
      try {
        await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`);
        setIsShinyAvailable(true);
      } catch (error) {
        setIsShinyAvailable(false);
        setIsShiny(false);
      }
    };

    const fetchEvolutionChain = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const evolutionChainUrl = response.data.evolution_chain.url;
        const evolutionChainResponse = await axios.get(evolutionChainUrl);
        setEvolutionChain(evolutionChainResponse.data);
      } catch (error) {
        console.error('Error fetching evolution chain:', error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchPokemonDetails(), fetchForms(), checkShinyAvailability(),fetchEvolutionChain()]);
    };
    
    const debouncedFetchData = _.debounce(() => {
      fetchData();
    }, 5);

    debouncedFetchData();
  }, [entryNumber, speciesName, pokemonId]);
  

  const handleIsShinyClick = () => {
    // Toggle isShiny only if shiny is available
    if (isShinyAvailable) {
      setIsShiny((prevIsShiny) => !prevIsShiny);
    }
  };

  const handleEvolutionButtonClick = () => {
    setShowEvolutionModal(true);
  };

  const handleArrowClick = async (direction: 'prev' | 'next') => {
    const currentIndex = forms.findIndex((form) => selectedForm?.id === form.id);
    let newIndex;
  
    if (direction === 'prev') {
      newIndex = currentIndex - 1 < 0 ? forms.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex + 1 >= forms.length ? 0 : currentIndex + 1;
    }
  
    const newSelectedForm = forms[newIndex];

    try {
      await axios.get(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${newSelectedForm.id}.png`);
      setIsShinyAvailable(true);
    } catch (error) {
      setIsShinyAvailable(false);
      setIsShiny(false);
    }
  
    if (newSelectedForm.id) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${newSelectedForm.id}`);
        const pokemonTypes = response.data.types.map((type: any) => type.type.name);

        setTypes(pokemonTypes);
        setExactPokemonName(response.data.name);
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    }
    setSelectedForm(newSelectedForm);
  };

  return (
    <>
    {showEvolutionModal && (
      <Modal onClose={() => setShowEvolutionModal(false)}>
        {renderEvolutionChain(evolutionChain.chain)}
      </Modal>
        )}
    <div className={`pokemon ${isCardVisible ? 'visible' : ''}`}>
      <h1 className="mon-entry">Pokédex entry : <strong>#{exactEntryNumber}</strong></h1>
      <h2 className="mon-name">{exactPokemonName}</h2>
      <div className="mon-types">
        {types.map((type, index) => (
          <img
            key={index}
            className={`mon-type ${type.toLowerCase()}`}
            src={`assets/types/${type.toLowerCase()}.webp`}
            alt={type}
            loading='lazy'
          />
        ))}
      </div>

      <img
        className="mon-img"
        src={(isShiny && isShinyAvailable) ? shinyImageUrl : (selectedForm ? selectedForm.imageUrl : regularImageUrl)}
        alt={speciesName}
        onClick={handleIsShinyClick}
      />

      {forms.length > 1 && (
        <div className="form-arrows">
          <button className='left-arrow arrow' onClick={() => handleArrowClick('prev')}>←</button>
          <button className='right-arrow arrow' onClick={() => handleArrowClick('next')}>→</button>
        </div>
      )}

      <button className="evolution-button" onClick={handleEvolutionButtonClick}>
          Show Evolution Line
      </button>

      <div className="body-info">
        <span className="height">{height}m</span>
        <span className="weight">{weight}kg</span>
      </div>
    </div>
    </>
  );
};

const renderEvolutionChain = (evolution: any) => {
  const id = evolution.species.url.split('/').slice(-2, -1)[0];
  const renderPokemon = (pokemon: any) => (
    <div key={pokemon?.id} className="evolution-pokemon">
      <img
        key={pokemon?.id}
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
      />
      <p>{pokemon?.name.charAt(0).toUpperCase() + pokemon?.name.slice(1)}</p>
    </div>
  );

  return (
    <React.Fragment key={evolution.species.name}>
      {renderPokemon(evolution.species)}
      {evolution.evolves_to && evolution.evolves_to.length > 0 && (
        <div className="evolution-arrow">&#8594;</div>
      )}
      {evolution.evolves_to && evolution.evolves_to.map(renderEvolutionChain)}
    </React.Fragment>
  );
};

export default PokemonEntry;