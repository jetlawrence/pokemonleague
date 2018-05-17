/* @flow */

import { action, observable } from 'mobx';

type PokemonData = {
  sprite?: any,
};

export default class Pokemon {
  @observable name: string = '';
  @observable sprite: string = '';

  constructor(name: string) {
    this.setName(name);
  }

  @action
  setName(name: string) {
    this.name = name;
  }

  @action
  setPokemonData(pokemonData: PokemonData) {
    this.sprite = pokemonData.sprite || this.sprite;
  }
}
