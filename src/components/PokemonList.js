/* @flow */

import debounce from 'lodash.debounce';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import type { Pokedex, PokemonTeam } from '../store';
import type Pokemon from '../entities/Pokemon';
import PokemonCell from './PokemonCell';

type Props = {
  pokedex: any | Pokedex,
  pokemonTeam: any | PokemonTeam,
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 2,
  },
  pokemonListContainer: {
    flex: 1,
    width: '100%',
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
  },
  navigationButton: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadButton: {
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
  },
  searchInputContainer: {
    padding: 10,
  },
  searchInput: {
    padding: 5,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

@inject('pokedex', 'pokemonTeam')
@observer
export default class PokemonList extends Component<Props> {
  static defaultProps = {
    pokedex: null,
    pokemonTeam: null,
  };

  componentWillMount() {
    this.props.pokedex.fetchPokemons();
  }

  onNextPress = () => {
    this.props.pokedex.fetchPokemons({ shouldFetchNextPage: true });
  };

  onPrevPress = () => {
    this.props.pokedex.fetchPokemons({ shouldFetchPrevPage: true });
  };

  onReload = () => {
    this.props.pokedex.reloadFetchPokemons();
  };

  onSearchTermChange = (searchTerm: string) => {
    this.props.pokedex.setSearchTerm(searchTerm);
  };

  onSearch = debounce(() => this.props.pokedex.searchPokemon(), 1000);

  onAddPokemonToTeam = (pokemon: Pokemon) => this.props.pokemonTeam.addPokemon(pokemon);

  render() {
    const { isLoading } = this.props.pokedex;

    return (
      <View style={styles.pokemonListContainer}>
        {this.renderSearchBar()}
        {isLoading ? this.renderLoadingView() : this.renderList()}
        {this.renderNavigationButtons()}
      </View>
    );
  }

  renderSearchBar() {
    return (
      <View style={styles.searchInputContainer}>
        <TextInput
          autoCorrect={false}
          onChangeText={this.onSearchTermChange}
          onEndEditing={this.onSearch}
          style={styles.searchInput}
        />
      </View>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderLoadingView() {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator />
      </View>
    );
  }

  renderErrorView() {
    return (
      <View style={styles.errorView}>
        <Text>Error Loading</Text>
        <TouchableOpacity onPress={() => this.onReload()} style={styles.reloadButton}>
          <Text>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderList() {
    const { isErrorLoading } = this.props.pokedex;

    if (isErrorLoading) {
      return this.renderErrorView();
    }
    return (
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={toJS(this.props.pokedex.currentDisplayedPokemons)}
        keyExtractor={(pokemon: Pokemon) => pokemon.name}
        renderItem={this.renderPokemonListItem}
      />
    );
  }

  renderPokemonListItem = (listItem: { item: Pokemon }) => {
    const { item: pokemon } = listItem;

    return <PokemonCell pokemon={pokemon} onAddPress={() => this.onAddPokemonToTeam(pokemon)} />;
  };

  renderNavigationButtons() {
    const { pokedex } = this.props;
    const { isLoading } = this.props.pokedex;

    return (
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          disabled={isLoading || !pokedex.hasPrev}
          onPress={this.onPrevPress}
          style={styles.navigationButton}
        >
          <Text>{'< Previous'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading || !pokedex.hasNext}
          onPress={this.onNextPress}
          style={styles.navigationButton}
        >
          <Text>{'Next >'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
