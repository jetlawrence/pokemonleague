/* @flow */

import React, { Component } from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import type Pokedex from '../store/Pokedex';

type Props = {
  pokedex: Pokedex,
};

@inject('pokedex')
@observer
export default class PokemonList extends Component<Props> {
  componentWillMount() {
    this.props.pokedex.fetchPokemons();
  }

  render() {
    return <View />;
  }
}
