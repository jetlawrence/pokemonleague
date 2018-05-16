/* @flow */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import PokemonTeamBuilder from './PokemonTeamBuilder';
import PokeAPIClient from './PokeAPIClient';
import Pokedex from './store/Pokedex';

const pokeAPIClient = new PokeAPIClient();
const pokedex = new Pokedex(pokeAPIClient);

export default class App extends Component {
  render() {
    return (
      <Provider pokedex={pokedex} pokeAPIClient={pokeAPIClient}>
        <PokemonTeamBuilder />
      </Provider>
    );
  }
}
