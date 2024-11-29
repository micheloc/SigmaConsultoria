import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import TabRoutes from 'component/table_navigation';

type RootStackParamList = {
  TabNavigator: any;
};

const Stack: any = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="navHome">
        <Stack.Screen name="navHome" component={TabRoutes} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigation;
