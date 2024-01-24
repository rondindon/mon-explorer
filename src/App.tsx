import React from 'react';
import {Route, BrowserRouter, Routes } from 'react-router-dom';
import Home from './components/Home';
import Pokedex from './components/Pokedex';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokedex/:pokedexName" element={<Pokedex />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;