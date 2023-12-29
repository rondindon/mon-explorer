import pokedex from '../assets/pokedex.png';

const Pokedex = ({name}: {name: string}) => {
    return(
    <div className="dex">
        <img src={pokedex} alt="pokedex"/>

        <h1 className="dex-name">{name}</h1>

        <button>Go</button>

    </div>
    )
};

export default Pokedex;