/* @flow */

import { action, observable } from 'mobx';
import { Pokemon } from '../entities';

export default class PokemonTeamMember {
  @observable pokemon: Pokemon;
  @observable nickname: string = '';

  constructor(pokemon: Pokemon) {
    this.setPokemon(pokemon);
  }

  @action
  setPokemon(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  @action
  setNickname(nickname: string) {
    this.nickname = nickname;
  }
}
