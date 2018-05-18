/* @flow */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { action, computed, observable, toJS } from 'mobx';
import { inject, observer } from 'mobx-react/native';
import { PokemonTeam } from '../store';
import { PokemonTeamMember } from '../entities/';
import PokemonCell from './PokemonCell';
import PokemonTeamMemberDetailsView from './PokemonTeamMemberDetailsView';

type Props = {
  pokemonTeam: any | PokemonTeam
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  lineUpContainer: {
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
  pokemonLineUpContainer: {
    flex: 1,
    borderWidth: 1,
  },
  pokemonDetailsContainer: {
    flex: 1,
    borderWidth: 1,
  },
});

@inject('pokemonTeam')
@observer
export default class PokemonTeamList extends Component<Props> {
  static defaultProps = {
    pokemonTeam: null,
  };
  static NUM_OF_POKEMON_PER_ROW = 2;

  @observable selectedPokemonPosition: number

  @action
  setSelectedPokemonPosition(position: number) {
    this.selectedPokemonPosition = position;
  }

  @computed
  get isAPokemonSelected(): boolean {
    return Boolean(this.selectedPokemonPosition &&
      this.selectedPokemonPosition >= 1 &&
      this.selectedPokemonPosition <= 6 &&
      this.props.pokemonTeam.pokemonMembers.length >= this.selectedPokemonPosition);
  }

  @computed
  get selectedPokemon(): ?PokemonTeamMember {
    return this.props.pokemonTeam.pokemonMembers[this.selectedPokemonPosition - 1];
  }

  onRemovePokemon = (position: number) =>
    this.props.pokemonTeam.removePokemon(position);

  onSelectPokemon = (position: number) => {
    this.setSelectedPokemonPosition(position);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.pokemonLineUpContainer}>
          {this.renderLineUp()}
        </View>
        <View style={styles.pokemonDetailsContainer}>
          {this.isAPokemonSelected && this.selectedPokemon &&
            <PokemonTeamMemberDetailsView pokemonTeamMember={this.selectedPokemon} />
          }
        </View>
      </View>
    );
  }

  renderLineUp() {
    const pokemonTeamMembers = toJS(this.props.pokemonTeam.pokemonMembers);
    const emptySlots = Array(PokemonTeam.MAX_NUM - pokemonTeamMembers.length).fill(null);
    const pokemonTeamSlots = [...pokemonTeamMembers, ...emptySlots];
    const firstRow = pokemonTeamSlots.slice(0, 2);
    const secondRow = pokemonTeamSlots.slice(2, 4);
    const thirdRow = pokemonTeamSlots.slice(4, 6);
    const rows = [firstRow, secondRow, thirdRow];

    return <View style={styles.lineUpContainer}>{rows.map(this.renderRow)}</View>;
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
  ) => {
    const position = (rowIndex * PokemonTeamList.NUM_OF_POKEMON_PER_ROW)
                  + cellIndex + 1;

    return (
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
          onPress={() => this.onSelectPokemon(position)}
          onRemovePress={() =>
                this.onRemovePokemon(position)
              }
        />
          )}
      </View>
    );
  };
}
