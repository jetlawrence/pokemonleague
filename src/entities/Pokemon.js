/* @flow */

import { action, observable } from 'mobx';

type PokemonExtendedData = {
  sprite?: string,
  type1?: string,
  type2?: string,
};

export default class Pokemon {
  @observable name: string = '';
  @observable sprite: string = '';
  @observable type1: string = '';
  @observable type2: string = '';

  constructor(name: string) {
    this.setName(name);
  }

  @action
  setName(name: string) {
    this.name = name;
  }

  @action
  update({ sprite, type1, type2 }: PokemonExtendedData) {
    this.setSprite(sprite);
    this.setType1(type1);
    this.setType2(type2);
  }

  @action
  setSprite(sprite: string = '') {
    this.sprite = sprite;
  }

  @action
  setType1(type1: string = '') {
    this.type1 = type1;
  }

  @action
  setType2(type2: string = '') {
    this.type2 = type2;
  }
}
