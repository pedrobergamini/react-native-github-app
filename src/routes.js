import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './screens/Main';
import User from './screens/User';
import Repository from './screens/Repository';

const Routes = createAppContainer(
  createStackNavigator(
    {
      Main,
      User,
      Repository,
    },
    {
      headerLayoutPreset: 'center',
      headerBackTitleVisible: false,
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#7159c1',
        },
        headerTintColor: '#fff',
      },
    }
  )
);

export default Routes;
