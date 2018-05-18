/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { PokemonList, PokemonTeamList } from './components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  pokemonListContainer: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pokemonTeamContainer: {
    flex: 1.5,
    borderWidth: StyleSheet.hairlineWidth,

  },
});

export default class PokemonTeamBuilder extends Component<*> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pokemonTeamContainer}>
          <PokemonTeamList />
        </View>
        <View style={styles.pokemonListContainer}>
          <PokemonList />
        </View>
      </View>
    );
  }
}
