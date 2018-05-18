/* @flow */

import React, { PureComponent } from 'react';
import { Image, View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { PokemonTeamMember } from '../entities';
import capitalizeFirstLetter from '../common/capitalizeFirstLetter';
import PokeBallPlaceholderImg from '../resources/pokeball.png';

type Props = {
  pokemonTeamMember: PokemonTeamMember
}

const styles = StyleSheet.create({
  detailsViewerContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  fullDetailsContainer: {
    flex: 1,
  },
  fullDetailsContentContainer: {
    padding: 10,
  },
  detailsSprite: {
    marginHorizontal: 5,
    width: '30%',
    height: '100%',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default class PokemonTeamMemberDetailsView extends PureComponent<Props> {
  render() {
    const { pokemon, nickname } = this.props.pokemonTeamMember;
    const { sprite, name } = pokemon;

    return (
      <View style={styles.detailsViewerContainer}>
        <Image
          style={styles.detailsSprite}
          source={sprite ? { uri: sprite } : PokeBallPlaceholderImg}
        />
        <ScrollView
          style={styles.fullDetailsContainer}
          contentContainerStyle={styles.fullDetailsContentContainer}
        >
          <Text style={styles.name}>
            {capitalizeFirstLetter(nickname || name)}
          </Text>
        </ScrollView>
      </View>
    );
  }
}
