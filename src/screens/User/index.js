import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

import github from '../../services/github';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Checks if the app has already loaded all user stars
  const [userLimit, setUserLimit] = useState(false);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const user = navigation.getParam('user');

  useEffect(() => {
    async function loadStars() {
      setLoading(true);

      const response = await github.get(`users/${user.login}/starred`);

      setStars(response.data);
      setLoading(false);
    }

    loadStars();
  }, [user.login]);

  async function loadMore() {
    if (userLimit) return;
    setLoadingMore(true);

    const nextPage = page + 1;

    const response = await github.get(
      `users/${user.login}/starred?page=${nextPage}`
    );

    if (!response.data.length) {
      setUserLimit(true);
      setLoadingMore(false);
      return;
    }

    setPage(nextPage);
    setLoadingMore(false);
    setStars([...stars, ...response.data]);
  }

  async function refreshList() {
    setRefreshing(true);

    const response = await github.get(`users/${user.login}/starred`);

    setStars(response.data);
    setPage(1);
    setUserLimit(false);
    setRefreshing(false);
  }

  function handleNavigate(repository) {
    navigation.navigate('Repository', { repository });
  }

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <ActivityIndicator color="#7159c1" size={50} />
      ) : (
        <Stars
          onRefresh={refreshList}
          refreshing={refreshing}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
      {loadingMore && !loading ? (
        <ActivityIndicator color="#7159c1" size={30} />
      ) : null}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
