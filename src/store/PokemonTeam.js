/* @flow */

import { action, computed, observable, IObservableArray } from 'mobx';
import { type Pokemon, PokemonTeamMember } from '../entities';

export default class PokemonTeam {
  static MAX_NUM: number = 6;

  @observable pokemonMembers: IObservableArray<PokemonTeamMember | null> = observable([]);

  @computed
  get isFull() {
    return this.pokemonMembers.length === PokemonTeam.MAX_NUM;
  }

  @action
  addPokemon(pokemon: Pokemon) {
    if (this.isFull) {
      return;
    }

    this.pokemonMembers.push(new PokemonTeamMember(pokemon));
  }

  @action
  removePokemon(position: number) {
    if (position < 1 || this.pokemonMembers.length < position) {
      return;
    }

    this.pokemonMembers.splice(position - 1, 1);
  }
}
