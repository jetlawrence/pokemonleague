/* @flow */

import React, { PureComponent } from 'react';
import { Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type Pokemon from '../entities/Pokemon';
import capitalizeFirstLetter from '../common/capitalizeFirstLetter';
import PokeBallPlaceholderImg from '../resources/pokeball.png';

type Props = {
  pokemon: Pokemon,
  customName?: string,
  isOnTeam?: boolean,
  onAddPress?: null | () => void,
  onRemovePress?: null | () => void,
};

const styles = StyleSheet.create({
  pokemonCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 5,
  },
  pokemonCellDetails: {
    flex: 1,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  addOrMinusButton: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pokemonSprite: {
    marginHorizontal: 5,
    width: 25,
    height: 25,
  },
  mainDetail: {
    fontSize: 14,
  },
  subDetail: {
    fontSize: 10,
  },
});

export default class PokemonCell extends PureComponent<Props> {
  static defaultProps = {
    customName: '',
    isOnTeam: false,
    onAddPress: null,
    onRemovePress: null,
  };

  render() {
    const {
      pokemon, customName, isOnTeam, onAddPress, onRemovePress,
    } = this.props;
    const {
      sprite, name, type1, type2, isReady,
    } = pokemon;
    const type1Str = capitalizeFirstLetter(type1);
    const type2Str = type2 ? ` / ${capitalizeFirstLetter(type2)}` : '';

    return (
      <View style={styles.pokemonCell}>
        <Image
          style={styles.pokemonSprite}
          source={sprite ? { uri: sprite } : PokeBallPlaceholderImg}
        />
        <View style={styles.pokemonCellDetails}>
          <Text style={styles.mainDetail}>{customName || capitalizeFirstLetter(name)}</Text>
          {
            isReady ? <Text style={styles.subDetail}>{`${type1Str}${type2Str}`}</Text> : <Text style={styles.subDetail}>Loading...</Text>
          }
        </View>
        {isReady &&
          <TouchableOpacity
            onPress={() => (isOnTeam ?
              onRemovePress && onRemovePress() :
              onAddPress && onAddPress())
            }
            style={styles.addOrMinusButton}
          >
            <Text>{isOnTeam ? '-' : '+'}</Text>
          </TouchableOpacity>
        }
      </View>
    );
  }
}
