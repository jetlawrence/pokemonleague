/* @flow */

import { action, observable } from 'mobx';

type PokemonExtendedData = {
  sprite?: string,
  type1?: string,
  type2?: string,
  description?: string,
};

export default class Pokemon {
  @observable id: string = ''
  @observable name: string = ''
  @observable sprite: string = ''
  @observable type1: string = ''
  @observable type2: string = ''
  @observable description: string = ''
  @observable isReady: boolean = false

  constructor(id: string, name: string) {
    this.setID(id);
    this.setName(name);
  }

  @action
  setID(id: string) {
    this.id = id;
  }

  @action
  setName(name: string) {
    this.name = name;
  }

  @action
  updateFullData({
    sprite, type1, type2, description,
  }: PokemonExtendedData) {
    this.setSprite(sprite);
    this.setType1(type1);
    this.setType2(type2);
    this.setDescription(description);
    this.isReadyNow();
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

  @action
  setDescription(description: string = '') {
    this.description = description;
  }

  @action
  isReadyNow() {
    this.isReady = true;
  }
}
