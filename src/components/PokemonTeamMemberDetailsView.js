/* @flow */

import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { Image, Modal, View, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import type { PokemonTeamMember } from '../entities';
import capitalizeFirstLetter from '../common/capitalizeFirstLetter';
import PokeBallPlaceholderImg from '../resources/pokeball.png';

type Props = {
  pokemonTeamMember: PokemonTeamMember,
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
  smallSprite: {
    marginHorizontal: 5,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  types: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginLeft: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  nameChangerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
  },
  nameChangerContainer: {
    width: '50%',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 20,
  },
  nameChangerModalScrollView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  nameInput: {
    padding: 5,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
  nameTextInputContainer: {
    flex: 1,
    padding: 10,
  },
  description: {
    marginTop: 20,
  },
});

@observer
export default class PokemonTeamMemberDetailsView extends Component<Props> {
  @observable isNameChangerModalVisible: boolean = false
  changedName: string = ''

  @action
  displayNameChangerModal() {
    const { pokemon, nickname } = this.props.pokemonTeamMember;
    const { name } = pokemon;

    this.changedName = capitalizeFirstLetter(nickname || name);
    this.isNameChangerModalVisible = true;
  }

  @action
  hideNameChangerModal() {
    this.isNameChangerModalVisible = false;
  }

  onEditPress = () => this.displayNameChangerModal()
  onUpdateName = () => {
    this.props.pokemonTeamMember.setNickname(this.changedName);
    this.hideNameChangerModal();
  }
  onChangeName = (changedName: string) => {
    this.changedName = changedName;
  }

  render() {
    const { pokemon, nickname } = this.props.pokemonTeamMember;
    const {
      sprite, name, type1, type2, description,
    } = pokemon;
    const type1Str = capitalizeFirstLetter(type1);
    const type2Str = type2 ? ` / ${capitalizeFirstLetter(type2)}` : '';
    const displayName = capitalizeFirstLetter(nickname || name);

    return (
      <React.Fragment>
        <View style={styles.detailsViewerContainer}>
          <Image
            resizeMode="contain"
            style={styles.detailsSprite}
            source={sprite ? { uri: sprite } : PokeBallPlaceholderImg}
          />
          <ScrollView
            style={styles.fullDetailsContainer}
            contentContainerStyle={styles.fullDetailsContentContainer}
          >
            <View style={styles.nameContainer}>
              <View>
                <Text style={styles.name}>
                  {displayName}
                </Text>
                <Text style={styles.types}>
                  {`${type1Str}${type2Str}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={this.onEditPress}
                style={styles.button}
              >
                <Text>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.description}>
              {description}
            </Text>
          </ScrollView>
        </View>
        {this.renderNameChangerModal()}
      </React.Fragment>
    );
  }

  renderNameChangerModal() {
    const { pokemonTeamMember } = this.props;
    const { pokemon, nickname } = pokemonTeamMember;
    const { sprite, name } = pokemon;

    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.isNameChangerModalVisible}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.nameChangerModal}>
          <KeyboardAwareScrollView contentContainerStyle={styles.nameChangerModalScrollView}>
            <View style={styles.nameChangerContainer}>
              <View style={styles.nameInputContainer}>
                <Image
                  resizeMode="contain"
                  style={styles.smallSprite}
                  source={sprite ? { uri: sprite } : PokeBallPlaceholderImg}
                />
                <View style={styles.nameTextInputContainer}>
                  <TextInput
                    autoCorrect={false}
                    defaultValue={capitalizeFirstLetter(nickname || name)}
                    onChangeText={this.onChangeName}
                    style={styles.nameInput}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={this.onUpdateName}
                style={styles.button}
              >
                <Text>Update</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}
