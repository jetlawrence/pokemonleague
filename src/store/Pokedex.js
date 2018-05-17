/* @flow */

import { action, observable, IObservableArray } from 'mobx';
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
  @observable pokemonsCache: IObservableArray<Pokemon> = observable([]);
  @observable currentDisplayedPokemons: IObservableArray<Pokemon> = observable([]);
  @observable isLoading: boolean = false;
  @observable nextPageURL: string;
  @observable previousPageURL: string;
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
  cachePokemon(pokemon: Pokemon) {
    this.pokemonsCache.push(pokemon);
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
    shouldFetchPreviousPage,
  }: {
      shouldFetchNextPage?: boolean,
      shouldFetchPreviousPage?: boolean,
    } = { shouldFetchNextPage: false, shouldFetchPreviousPage: false }) {
    try {
      this.startLoading();

      const { getPokemonDataByURL, getPokemonList } = this.pokeAPIClient;
      let pokemonListData = null;
      const nextPage = shouldFetchNextPage && this.nextPageURL;
      const prevPage = shouldFetchPreviousPage && this.previousPageURL;

      if (nextPage) {
        pokemonListData = await getPokemonDataByURL(this.nextPageURL);
      } else if (prevPage) {
        pokemonListData = await getPokemonDataByURL(this.previousPageURL);
      } else {
        pokemonListData = await getPokemonList({
          limit: Pokedex.NUM_OF_PKMNS_PER_PAGE,
        });
      }

      if (pokemonListData) {
        this.processPokemonListRawData(pokemonListData);
        this.successLoading();
      } else {
        this.errorLoading();
      }
    } catch (error) {
      this.errorLoading();
    }

    this.finishLoading();
  }

  async loadFullPokemonData(pokemon: Pokemon, url: string) {
    try {
      const fullPokemonData = await this.pokeAPIClient.getPokemonDataByURL(url);
      const spriteData = await this.pokeAPIClient.getPokemonDataByURL(fullPokemonData.forms[0]);
      const sprite = spriteData.sprites.front_default;

      pokemon.setPokemonData({ sprite });
    } catch (error) {
      console.log(`Error loading data for ${pokemon.name}`);
    }
  }

  processPokemonListRawData(pokemonListData: PokemonListRawData) {
    const pokemons = this.formatPokemonListRawData(pokemonListData);
    this.setCurrentDisplayedPokemons(pokemons);
  }

  formatPokemonListRawData(pokemonListData: PokemonListRawData): Array<Pokemon> {
    return pokemonListData.results.map(this.getPokemonFromRawData);
  }

  getPokemonFromRawData = (pokemonInitialRawData: PokemonInitialRawData): Pokemon => {
    const { name, url } = pokemonInitialRawData;
    const cachedPokemon = this.getCachedPokemon(name);
    const pokemon = cachedPokemon || new Pokemon(name);

    this.loadFullPokemonData(pokemon, url);

    if (!cachedPokemon) {
      this.cachePokemon(pokemon);
    }

    return pokemon;
  };

  getCachedPokemon(name: string): ?Pokemon {
    const isCached = (cachedPokemon: Pokemon) =>
      cachedPokemon.name.toLowerCase() === name.toLowerCase();

    return this.pokemonsCache.find(isCached);
  }
}
