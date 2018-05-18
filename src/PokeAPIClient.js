/* @flow */

/* eslint-disable class-methods-use-this */
export default class PokeAPIClient {
  static BASE_URL = 'https://pokeapi.co/api/v2';
  static NOT_FOUND_ERROR = 'NOT_FOUND';

  async getPokemonList({ limit, offset = 0 }: { limit: number, offset?: number }): Object {
    try {
      const response = await fetch(`${PokeAPIClient.BASE_URL}/pokemon/?limit=${limit}&offset=${offset}/`);

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      return null;
    }
  }

  async getPokemonByName(name: string): Object {
    try {
      const response = await fetch(`${PokeAPIClient.BASE_URL}/pokemon/${name}`);

      const responseJSON = await response.json();

      if (responseJSON && responseJSON.detail && responseJSON.detail === 'Not found.') {
        return { error: PokeAPIClient.NOT_FOUND_ERROR };
      }

      if (!response.ok) {
        return null;
      }

      return responseJSON;
    } catch (error) {
      return null;
    }
  }

  async getPokemonDataByURL(url: string): Object {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      return null;
    }
  }

  async getPokemonDescription(name: string): Object {
    try {
      const response = await fetch(`${PokeAPIClient.BASE_URL}/pokemon-species/${name}`);

      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      return null;
    }
  }
}
/* eslint-enable class-methods-use-this */
