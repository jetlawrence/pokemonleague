/* @flow */

import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import PokemonTeamBuilder from './PokemonTeamBuilder';
import PokeAPIClient from './PokeAPIClient';
import { Pokedex } from './store';
import PokemonTeam from './store/PokemonTeam';

const pokeAPIClient = new PokeAPIClient();
const pokedex = new Pokedex(pokeAPIClient);
const pokemonTeam = new PokemonTeam();

export default class App extends Component<*> {
  render() {
    return (
      <Provider pokedex={pokedex} pokeAPIClient={pokeAPIClient} pokemonTeam={pokemonTeam}>
        <PokemonTeamBuilder />
      </Provider>
    );
  }
}
