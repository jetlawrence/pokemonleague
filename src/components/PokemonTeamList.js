/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { PokemonTeam, PokemonTeamMember } from '../store';
import PokemonCell from './PokemonCell';

type Props = {
  pokemonTeam: any | PokemonTeam
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pokemonCell: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  minusButton: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

@inject('pokemonTeam')
@observer
export default class PokemonTeamList extends Component<Props> {
  static defaultProps = {
    pokemonTeam: null,
  };
  static NUM_OF_POKEMON_PER_ROW = 2;

  onRemovePokemon = (position: number) =>
    this.props.pokemonTeam.removePokemon(position);

  render() {
    const pokemonTeamMembers = toJS(this.props.pokemonTeam.pokemonMembers);
    const emptySlots = Array(PokemonTeam.MAX_NUM - pokemonTeamMembers.length).fill(null);
    const pokemonTeamSlots = [...pokemonTeamMembers, ...emptySlots];
    const firstRow = pokemonTeamSlots.slice(0, 2);
    const secondRow = pokemonTeamSlots.slice(2, 4);
    const thirdRow = pokemonTeamSlots.slice(4, 6);
    const rows = [firstRow, secondRow, thirdRow];

    return <View style={styles.container}>{rows.map(this.renderRow)}</View>;
  }

  renderRow = (row: Array<PokemonTeamMember | null> = [], rowIndex: number) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((member, cellIndex) =>
        this.renderPokemonCell(member, rowIndex, cellIndex))}
    </View>
  );

  renderPokemonCell = (
    member: PokemonTeamMember | null,
    rowIndex: number,
    cellIndex: number,
  ) => (
    <View
      key={
        member
          ? `${member.pokemon.name}_${rowIndex}_${cellIndex}`
          : `${rowIndex}_${cellIndex}`
      }
      style={styles.pokemonCell}
    >
      {member && (
        <PokemonCell
          pokemon={member.pokemon}
          customName={member.nickname}
          isOnTeam
          onRemovePress={() =>
            this.onRemovePokemon((rowIndex * PokemonTeamList.NUM_OF_POKEMON_PER_ROW)
              + cellIndex + 1)
          }
        />
      )}
    </View>
  );
}
