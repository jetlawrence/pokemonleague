/* @flow */

import { action, observable } from 'mobx';

type PokemonData = {
  name: string,
  sprite?: string,
};

export default class Pokemon {
  @observable name: string = '';
  @observable sprite: string = '';

  constructor({ name, sprite = '' }: PokemonData) {
    this.setName(name);
    this.setSprite(sprite);
  }

  @action
  setName(name: string) {
    this.name = name;
  }

  @action
  setSprite(sprite: string) {
    this.sprite = sprite;
  }
}
