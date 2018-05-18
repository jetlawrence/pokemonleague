/* @flow */

import { action, computed, observable, IObservableArray } from 'mobx';
import { Pokemon } from '../entities';
import PokeAPIClient from '../PokeAPIClient';

type PokemonURLRawData = {
  url: string,
  name: string,
};

type PokemonListRawData = {
  count: number,
  previous: string | null,
  results: Array<PokemonURLRawData>,
  next: string | null,
};

type PokemonRawData = {
  id: number,
  forms: Array<PokemonURLRawData>,
  types: Array<{ slot: number, type: PokemonURLRawData }>,
};

const getIDFromUrl = (url: string) => {
  const substrings = url.trim().split('/').filter(substr => substr.length > 0);
  return substrings[substrings.length - 1];
};

export default class Pokedex {
  @observable cachedPokemons: IObservableArray<Pokemon> = observable([]);
  @observable currentDisplayedPokemons: IObservableArray<Pokemon> = observable([]);
  @observable isLoading: boolean = false;
  @observable isLoadingNext: boolean = false;
  @observable isLoadingPrev: boolean = false;
  @observable isSearchingPokemon: boolean = false;
  @observable nextPageURL: string | null;
  @observable previousPageURL: string | null;
  @observable isErrorLoading: boolean = false;
  @observable searchTerm: string = '';

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
    this.cachedPokemons.push(pokemon);
  }

  @action
  startLoading() {
    this.isErrorLoading = false;
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
  startLoadingPrev() {
    this.isLoadingPrev = true;
  }

  @action
  finishLoadingPrev() {
    this.isLoadingPrev = false;
  }

  @action
  startSearchingPokemon() {
    this.isSearchingPokemon = true;
  }

  @action
  finishSearchingPokemon() {
    this.isSearchingPokemon = false;
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
    this.finishLoading();
  }

  @action
  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  @computed
  get hasNext(): boolean {
    return Boolean(this.nextPageURL);
  }

  @computed
  get hasPrev(): boolean {
    return Boolean(this.previousPageURL);
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
      } else {
        this.errorLoading();

        return;
      }
    } catch (error) {
      this.errorLoading();

      return;
    }

    this.finishLoading();
  }

  async searchPokemon() {
    try {
      if (this.isLoading) {
        return;
      }

      if (!this.searchTerm.length) {
        await this.fetchPokemons();
        return;
      }

      this.startLoading();
      this.startSearchingPokemon();

      this.setPreviousPageURL(null);
      this.setNextPageURL(null);

      const pokemonName = this.searchTerm.trim().toLowerCase();
      const cachedPokemon = this.getCachedPokemonByName(pokemonName);

      if (cachedPokemon) {
        this.setCurrentDisplayedPokemons([cachedPokemon]);
        this.finishSearchingPokemon();
      } else {
        const pokemonRawData = await this.pokeAPIClient.getPokemonByName(pokemonName);

        if (pokemonRawData.error && pokemonRawData.error === PokeAPIClient.NOT_FOUND_ERROR) {
          this.setCurrentDisplayedPokemons([]);
          this.finishSearchingPokemon();
        } else {
          const pokemon = new Pokemon(`${pokemonRawData.id}`, pokemonName);
          this.setCurrentDisplayedPokemons([pokemon]);

          this.resolvePokemonData(pokemonName, pokemonRawData);
        }
      }
    } catch (error) {
      this.errorLoading();

      return;
    }

    this.finishLoading();
  }

  processPokemonListRawData(pokemonListRawData: PokemonListRawData) {
    const { previous, next } = pokemonListRawData;
    this.setPreviousPageURL(previous);
    this.setNextPageURL(next);

    const pokemons = pokemonListRawData.results.map(({ name, url }) => {
      const id = getIDFromUrl(url);
      const cachedPokemon = this.getCachedPokemon(id);
      return cachedPokemon || new Pokemon(id, name);
    });

    this.setCurrentDisplayedPokemons(pokemons);
    this.resolveCurrentlyDisplayedPokemons(pokemonListRawData);
  }

  async resolveCurrentlyDisplayedPokemons(pokemonListRawData: PokemonListRawData) {
    await Promise.all(pokemonListRawData.results.map(this.onResolveCurrentlyDisplayedPokemon));
  }

  onResolveCurrentlyDisplayedPokemon = async (pokemonInitialRawData: PokemonURLRawData) => {
    const { name, url } = pokemonInitialRawData;
    const pokemonRawData = await this.pokeAPIClient.getPokemonDataByURL(url);
    const id = getIDFromUrl(url);
    const isCached = Boolean(this.getCachedPokemon(id));
    if (!isCached) {
      await this.resolvePokemonData(name, pokemonRawData);
    }
  };

  async resolvePokemonData(name: string, pokemonRawData: PokemonRawData) {
    try {
      const pokemonToUpdate = this.currentDisplayedPokemons.find(pokemon => pokemon.name === name);

      const { types = [] } = pokemonRawData;
      const [spriteData, descriptionData] = await Promise.all([
        this.pokeAPIClient.getPokemonDataByURL(pokemonRawData.forms[0].url),
        this.pokeAPIClient.getPokemonDescription(name),
      ]);
      const sprite = spriteData.sprites.front_default;
      const englishDescriptionData = descriptionData.flavor_text_entries.find(entry => entry.language.name === 'en');
      const description = englishDescriptionData.flavor_text;

      const type1Data = types.find(type => type.slot === 1);
      const type2Data = types.find(type => type.slot === 2);
      const type1 = type1Data ? type1Data.type.name : '';
      const type2 = type2Data ? type2Data.type.name : '';


      pokemonToUpdate.updateFullData({
        sprite, type1, type2, description,
      });
      this.cachePokemon(pokemonToUpdate);
    } catch (error) {
      console.log('Error resolving pokemon data');
    }
  }

  getCachedPokemon = (id: string) =>
    this.cachedPokemons.find(cachedPokemon => cachedPokemon.id === id)

  getCachedPokemonByName = (name: string) =>
    this.cachedPokemons.find(cachedPokemon => cachedPokemon.name === name)
}
