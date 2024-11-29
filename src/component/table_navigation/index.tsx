import Home from 'navigations/home';
import Icon from 'react-native-vector-icons/FontAwesome6';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#1B437E', // cor de fundo da barra
            paddingBottom: 5, // padding para ajuste de espaço
            height: 75,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            title: 'Principal',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <View>
                <Image
                  source={require('assets/img/logo_sigma.png')}
                  style={{ margin: 8, width: 60, height: 60 }}
                />
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity>
                <Image
                  source={require('assets/img/Icons/sair.png')}
                  style={{ margin: 8, width: 40, height: 40 }}
                />
              </TouchableOpacity>
            ),
            tabBarIcon: () => (
              <Image
                source={require('assets/img/Icons/home.png')}
                style={{ margin: 8, width: 35, height: 35 }}
              />
            ),
            tabBarLabelStyle: {
              padding: 8,
              fontSize: 18,
              color: 'whitesmoke',
            },
            tabBarActiveBackgroundColor: '#010371',
          }}
        />

        <Tab.Screen
          name="relatorio"
          component={Home}
          options={{
            headerShown: false,
            title: 'Relatório',
            tabBarLabelStyle: {
              padding: 8,
              fontSize: 18,
              color: 'whitesmoke',
            },
            tabBarIcon: () => (
              <Image
                source={require('assets/img/Icons/relatorio.png')}
                style={{ margin: 8, width: 35, height: 35 }}
              />
            ),
            tabBarActiveBackgroundColor: '#010371',
          }}
        />

        <Tab.Screen
          name="cliente"
          component={Home}
          options={{
            headerShown: false,
            title: 'Clientes',
            tabBarLabelStyle: {
              padding: 8,
              fontSize: 18,
              color: 'whitesmoke',
            },
            tabBarIcon: () => (
              <Image
                source={require('assets/img/Icons/clientes.png')}
                style={{ margin: 8, width: 35, height: 35 }}
              />
            ),
            tabBarActiveBackgroundColor: '#010371',
          }}
        />
      </Tab.Navigator>
    </>
  );
};
export default TabRoutes;
