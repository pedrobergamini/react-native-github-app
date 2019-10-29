import React from 'react';
import PropTypes from 'prop-types';

import { Browser } from './styles';

export default function Repository({ navigation }) {
  const uri = navigation.getParam('repository').html_url;

  return <Browser source={{ uri }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});
