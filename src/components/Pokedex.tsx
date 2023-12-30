import pokedex from '../assets/pokedex.png';

interface PokedexProps {
    name: string;
    onClick: () => void;
  }

const Pokedex: React.FC<PokedexProps> = ({ name, onClick }: PokedexProps) => {

    return(
    <div className="dex">
        <img src={pokedex} alt="pokedex"/>

        <h1 className="dex-name">{name}</h1>

        <button onClick={onClick}>Go</button>

    </div>
    )
};

export default Pokedex;