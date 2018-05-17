/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { PokemonList } from './components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  searchContainer: {
    flex: 1,
    borderWidth: 5,
  },
  pokemonTeamContainer: {
    flex: 1.5,
    borderWidth: 5,
  },
  pokemonLineUpContainer: {
    flex: 1,
    borderWidth: 5,
  },
  pokemonDetailsContainer: {
    flex: 1,
    borderWidth: 5,
  },
});

export default class PokemonTeamBuilder extends Component<*> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.pokemonTeamContainer}>
          <View style={styles.pokemonLineUpContainer} />
          <View style={styles.pokemonDetailsContainer} />
        </View>
        <View style={styles.searchContainer}>
          <PokemonList />
        </View>
      </View>
    );
  }
}
