import AuthContext from 'context_provider/index';
import context_realm from 'context_realm/index';
import Cliente from 'navigations/cliente';
import Home from 'navigations/home';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { _user } from 'services/login_service';

const Tab = createBottomTabNavigator();

const TabRoutes = () => {
  const [user, setUser] = useState<any>();

  const { check } = useContext(AuthContext);

  useEffect(() => {
    /** * Este método será responsável por carregar os dados do cliente ao entrar nessa tela. */
    const setUsuario = async () => {
      const obj = await _user();
      setUser(obj);
    };

    setUsuario();
  }, []);

  const exit = () => {
    Alert.alert(
      'Alerta!',
      `Você deseja realmente encerrar sua sessão?\nobs: Ao encerrar, todas as informações do banco interno será removidas.`,
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            let realm = await context_realm();

            realm.write(() => {
              realm.deleteAll(); // Remove todos os objetos do banco de dados
            });

            realm.close();

            await check();
          },
        },
      ]
    );
  };

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
            headerTitle: user ? user.usuario : '',
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
              <TouchableOpacity onPress={() => exit()}>
                <Image
                  source={require('assets/img/Icons/sair.png')}
                  style={{ margin: 8, width: 40, height: 40 }}
                />
              </TouchableOpacity>
            ),
            tabBarLabel: () => (
              <View>
                <Text style={{ padding: 8, fontSize: 18, color: 'whitesmoke' }}>Principal</Text>
              </View>
            ),
            tabBarIcon: () => (
              <View>
                <Image
                  source={require('assets/img/Icons/home.png')}
                  style={{ margin: 8, width: 35, height: 35 }}
                />
              </View>
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
            tabBarLabel: () => (
              <View>
                <Text style={{ padding: 8, fontSize: 18, color: 'whitesmoke' }}>Relatório</Text>
              </View>
            ),
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
          name="Cliente"
          component={Cliente}
          options={{
            headerShown: true,
            headerTitleAlign: 'center',
            tabBarLabel: () => (
              <View>
                <Text style={{ padding: 8, fontSize: 18, color: 'whitesmoke' }}>Cliente</Text>
              </View>
            ),
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
