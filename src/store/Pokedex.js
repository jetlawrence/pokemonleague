/* @flow */

import { action, computed, observable, IObservableArray } from 'mobx';
import Pokemon from '../entities/Pokemon';
import PokeAPIClient from '../PokeAPIClient';

type PokemonInitialRawData = {
  url: string,
  name: string,
};

type PokemonListRawData = {
  count: number,
  previous: string | null,
  results: Array<PokemonInitialRawData>,
  next: string | null,
};

export default class Pokedex {
  @observable currentDisplayedPokemons: IObservableArray<Pokemon> = observable([]);
  @observable isLoading: boolean = false;
  @observable isLoadingNext: boolean = false;
  @observable isLoadingPrev: boolean = false;
  @observable nextPageURL: string | null;
  @observable previousPageURL: string | null;
  @observable isErrorLoading: boolean = false;

  static NUM_OF_PKMNS_PER_PAGE = 20;

  pokeAPIClient: PokeAPIClient;

  constructor(pokeAPIClient: PokeAPIClient) {
    this.pokeAPIClient = pokeAPIClient;
  }

  @action
  setCurrentDisplayedPokemons(currentDisplayedPokemons: Array<Pokemon>) {
    this.currentDisplayedPokemons.replace(currentDisplayedPokemons);
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
  startLoadingNext() {
    this.isLoadingNext = true;
  }

  @action
  finishLoadingNext() {
    this.isLoadingNext = false;
  }

  @action
  finishLoadingPrev() {
    this.isLoadingPrev = false;
  }

  @action
  startLoadingPrev() {
    this.isLoadingPrev = true;
  }

  @action
  setNextPageURL(url: string | null) {
    this.nextPageURL = url;
  }

  @action
  setPreviousPageURL(url: string | null) {
    this.previousPageURL = url;
  }

  @action
  errorLoading() {
    this.isErrorLoading = true;
  }

  @computed
  get hasNext(): boolean {
    return Boolean(this.nextPageURL);
  }

  @computed
  get hasPrev(): boolean {
    return Boolean(this.previousPageURL);
  }

  @action
  successLoading() {
    this.isErrorLoading = false;
  }

  reloadFetchPokemons() {
    if (this.isLoadingNext) {
      this.fetchPokemons({ shouldFetchNextPage: true });
    } else if (this.isLoadingPrev) {
      this.fetchPokemons({ shouldFetchPrevPage: true });
    } else {
      this.fetchPokemons();
    }
  }

  async fetchPokemons({
    shouldFetchNextPage,
    shouldFetchPreviousPage,
  }: {
      shouldFetchNextPage?: boolean,
      shouldFetchPreviousPage?: boolean,
    } = { shouldFetchNextPage: false, shouldFetchPreviousPage: false }) {
    try {
      if (this.isLoading) {
        return;
      }
      this.startLoading();

      const { getPokemonDataByURL, getPokemonList } = this.pokeAPIClient;
      let pokemonListData = null;

      if (shouldFetchNextPage) {
        this.startLoadingNext();
        if (this.nextPageURL) {
          pokemonListData = await getPokemonDataByURL(this.nextPageURL);
        }
      } else if (shouldFetchPreviousPage) {
        this.startLoadingPrev();
        if (this.previousPageURL) {
          pokemonListData = await getPokemonDataByURL(this.previousPageURL);
        }
      } else {
        pokemonListData = await getPokemonList({
          limit: Pokedex.NUM_OF_PKMNS_PER_PAGE,
        });
      }

      if (pokemonListData) {
        await this.processPokemonListRawData(pokemonListData);
        this.finishLoadingNext();
        this.finishLoadingPrev();
        this.successLoading();
      } else {
        this.errorLoading();
      }
    } catch (error) {
      this.errorLoading();
    }

    this.finishLoading();
  }

  async processPokemonListRawData(pokemonListData: PokemonListRawData) {
    const { previous, next } = pokemonListData;
    this.setPreviousPageURL(previous);
    this.setNextPageURL(next);

    const pokemons = await this.formatPokemonListRawData(pokemonListData);
    this.setCurrentDisplayedPokemons(pokemons);
  }

  async formatPokemonListRawData(pokemonListData: PokemonListRawData): Promise<Array<Pokemon>> {
    const pokemons = await Promise.all(pokemonListData.results.map(this.resolvePokemonData));

    return pokemons;
  }

  resolvePokemonData = async (pokemonInitialRawData: PokemonInitialRawData): Promise<Pokemon> => {
    const { name, url } = pokemonInitialRawData;
    try {
      const fullPokemonData = await this.pokeAPIClient.getPokemonDataByURL(url);
      const spriteData = await this.pokeAPIClient.getPokemonDataByURL(fullPokemonData.forms[0]);
      const sprite = spriteData.sprites.front_default;

      return new Pokemon({ name, sprite });
    } catch (error) {
      return new Pokemon({ name });
    }
  };
}
