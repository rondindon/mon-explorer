import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

interface PokemonEntryProps {
  entryNumber: number;
  speciesName: string;
  speciesUrl: string;
  pokemonSearch: string;
  sortCriteria: string; // Add sortCriteria prop
  sortOrder: string; // Add sortOrder prop
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
    const [pokemonName, setPokemonName] = useState<string>("")
    const [forms, setForms] = useState<Form[]>([]);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);

    const pokemonId = speciesUrl.match(/\/(\d+)\/$/)?.[1];

    const entryNumberRef = useRef(entryNumber);
    const pokemonIdRef = useRef(pokemonId);
    const speciesNameRef = useRef(speciesName);

    const getPokemonNumber = (url: string): number => {
      const matches = url.match(/\/(\d+)\/$/);
      return matches && matches.length === 2 ? parseInt(matches[1], 10) : 0;
  };

    const shinyImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${selectedForm?.id}.png`;
    const regularImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonNumber(speciesUrl)}.png`;

    const handleIsShinyClick = async () => {
      // Toggle isShiny only if shiny is available
      if (isShinyAvailable) {
        setIsShiny((prevIsShiny) => !prevIsShiny);
      }
    };

    const handleArrowClick = (direction: 'prev' | 'next') => {
      const currentIndex = forms.findIndex((form) => selectedForm?.id === form.id);
      let newIndex;
  
      if (direction === 'prev') {
        newIndex = currentIndex - 1 < 0 ? forms.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex + 1 >= forms.length ? 0 : currentIndex + 1;
      }
  
      setSelectedForm(forms[newIndex]);
      console.log(selectedForm?.id)
    };

    useEffect(() => {
      entryNumberRef.current = entryNumber;
    }, [entryNumber]);

    useEffect(() => {
      pokemonIdRef.current = pokemonId;
    }, [pokemonId]);

    useEffect(() => {
      speciesNameRef.current = speciesName;
    }, [speciesName]);

    useEffect(() => {
      const checkShinyAvailability = async () => {
        try {
          await axios.get(shinyImageUrl);
          setIsShinyAvailable(true);
        } catch (error) {
          setIsShinyAvailable(false);
          setIsShiny(false);
        }
      };
      checkShinyAvailability();
    }, [getPokemonNumber])
    

    useEffect(() => {
      const fetchPokemonDetails = async () => {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${speciesNameRef.current}`);
          const pokemonTypes = response.data.types.map((type: any) => type.type.name);
          setTypes(pokemonTypes);
  
          const weightKG = Number((response.data.weight * 0.1).toFixed(2));
          const heightM = Number((response.data.height * 0.1).toFixed(3));
  
          setWeight(weightKG);
          setHeight(heightM);
        } catch (error) {
          console.error('Error fetching Pokemon details:', error);
        }
      };

      const debouncedFetchPokemonDetails = _.debounce(() => {
        fetchPokemonDetails();
      }, 5);
  
      debouncedFetchPokemonDetails();
    }, [speciesName, pokemonSearch, sortCriteria, sortOrder]);

    useEffect(() => {
      setIsShiny(false);
    }, [pokemonSearch,sortOrder,sortCriteria,speciesName]);

    useEffect(() => {
      const fetchForms = async () => {
        try {
          const responseForms = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${getPokemonNumber(speciesUrl)}`);
          const varieties = responseForms.data.varieties;
          const defaultForm: Form = {
            id: entryNumber,
            isShiny: false,
            imageUrl: regularImageUrl,
            types: [], // Add types for the default form
          };
    
          if (varieties && varieties.length > 1) {
            const formList: Form[] = [
              defaultForm,
              ...varieties
                .filter((variety: any) => !variety.is_default)
                .map((variety: any) => {
                  const formId = getPokemonNumber(variety.pokemon.url);
                  const formImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`;
                  const form: Form = {
                    id: formId,
                    isShiny: false,
                    imageUrl: formImageUrl,
                    types: [], // Initialize with an empty array for types
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
    
      fetchForms();
    }, [pokemonSearch, sortOrder, sortCriteria, pokemonId])
    
    

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
        src={(isShiny && isShinyAvailable) ? shinyImageUrl : (selectedForm ? selectedForm.imageUrl : regularImageUrl)}
        alt={speciesName}
        onClick={handleIsShinyClick}
        loading="lazy"
      />

      {forms.length > 1 && (
        <div className="form-arrows">
          <button onClick={() => handleArrowClick('prev')}>←</button>
          <button onClick={() => handleArrowClick('next')}>→</button>
        </div>
      )}

      <div className="body-info">
        <span className="height">{height}m</span>
        <span className="weight">{weight}kg</span>
      </div>

    </div>
  );
};

export default PokemonEntry;