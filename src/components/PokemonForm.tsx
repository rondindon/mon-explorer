import React from 'react';

interface PokemonFormCarouselProps {
  forms: number[];
  onSelectForm: (formId: number) => void;
  selectedFormId: number | null;
}

const PokemonFormCarousel: React.FC<PokemonFormCarouselProps> = ({ forms, onSelectForm, selectedFormId }) => {
  return (
    <div className="form-carousel">
      {forms.map((formId, index) => (
        <div
          key={index}
          className={`form-item ${formId === selectedFormId ? 'selected' : ''}`}
          onClick={() => onSelectForm(formId)}
        >
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`}
            alt={`Form ${formId}`}
          />
        </div>
      ))}
    </div>
  );
};

export default PokemonFormCarousel;