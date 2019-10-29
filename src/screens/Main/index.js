import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import github from '../../services/github';

export default function Main({ navigation }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      const storageUsers = await AsyncStorage.getItem('users');

      if (storageUsers) {
        setUsers(JSON.parse(storageUsers));
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function saveUsers() {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }

    saveUsers();
  }, [users]);

  async function handleAddUser() {
    setLoading(true);
    const response = await github.get(`users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);
    setNewUser('');
    setLoading(false);

    Keyboard.dismiss();
  }

  async function handleNavigate(user) {
    navigation.navigate('User', { user });
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />

        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <MaterialIcons name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({ item }) => (
          <User>
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver Perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Usuários',
};

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};
