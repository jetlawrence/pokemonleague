/* @flow */

import { action, observable, IObservableArray } from 'mobx';
import Pokemon from '../entities/Pokemon';
import type PokeAPIClient from '../PokeAPIClient';

export default class Pokedex {
  @observable currentPokemons: IObservableArray<Pokemon> = observable([]);
  @observable isLoading: boolean = false;
  @observable nextPageURL: string;
  @observable previousPageURL: string;
  @observable isErrorLoading: boolean = false;

  pokeAPIClient: PokeAPIClient;

  constructor(pokeAPIClient: PokeAPIClient) {
    this.pokeAPIClient = pokeAPIClient;
  }

  @action
  setCurrentPokemons(currentPokemons: Array<Pokemon>) {
    this.currentPokemons.replace(currentPokemons);
  }

  @action
  startLoading() {
    this.isLoading = true;
  }

  @action
  finishLoading() {
    this.isLoading = false;
  }

  @action
  setNextPageURL(url: string) {
    this.nextPageURL = url;
  }

  @action
  setPreviousPageURL(url: string) {
    this.previousPageURL = url;
  }

  @action
  errorLoading() {
    this.isErrorLoading = true;
  }

  @action
  successLoading() {
    this.isErrorLoading = false;
  }

  async fetchPokemons({
    shouldFetchNextPage,
    shouldPreviousPage,
  }: {
      shouldFetchNextPage?: boolean,
      shouldPreviousPage?: boolean,
    } = { shouldFetchNextPage: false, shouldPreviousPage: false }) {
    try {
      this.startLoading();

      const { getPokemonDataByURL, getPokemonList } = this.pokeAPIClient;

      let pokemonListData = null;

      if (shouldFetchNextPage) {
        pokemonListData = await getPokemonDataByURL(this.nextPageURL);
      } else if (shouldPreviousPage) {
        pokemonListData = await getPokemonDataByURL(this.previousPageURL);
      } else {
        pokemonListData = await getPokemonList({ limit: 20 });
      }

      if (pokemonListData) {
        this.successLoading();
      } else {
        this.errorLoading();
      }
    } catch (error) {
      this.errorLoading();
    }

    this.finishLoading();
  }
}
