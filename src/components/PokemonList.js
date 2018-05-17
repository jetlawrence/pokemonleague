/* @flow */

import React, { Component } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type Pokedex from '../store/Pokedex';
import type Pokemon from '../entities/Pokemon';
import capitalizeString from '../common/capitalizeString';

type Props = {
  pokedex: any | Pokedex,
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 2,
  },
  pokemonListItem: {
    width: '100%',
    padding: 10,
  },
});

@inject('pokedex')
@observer
export default class PokemonList extends Component<Props> {
  static defaultProps = {
    pokedex: null,
  };

  componentWillMount() {
    this.props.pokedex.fetchPokemons();
  }

  render() {
    return (
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={this.props.pokedex.currentDisplayedPokemons}
        extraData={this.props.pokedex.isLoading}
        keyExtractor={(pokemon: Pokemon) => pokemon.name}
        renderItem={this.renderPokemonListItem}
      />
    );
  }

  // eslint-disable-next-line class-methods-use-this
  renderPokemonListItem(listItem: { item: Pokemon }) {
    const { item: pokemon } = listItem;

    return (
      <View style={styles.pokemonListItem}>
        <Text>{capitalizeString(pokemon.name)}</Text>
      </View>
    );
  }
}
