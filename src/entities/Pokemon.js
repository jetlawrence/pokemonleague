/* @flow */

import { action, observable } from 'mobx';

type PokemonParams = {
  name: string,
  apiURL: string,
};

export default class Pokemon {
  @observable name: string = '';
  @observable apiURL: string = '';

  constructor(pokemonParams: PokemonParams) {
    this.setParams(pokemonParams);
  }

  @action
  setParams(pokemonProperties: PokemonParams) {
    this.name = pokemonProperties.name;
    this.apiURL = pokemonProperties.apiURL;
  }
}
