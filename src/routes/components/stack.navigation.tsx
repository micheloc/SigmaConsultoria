import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Avaliacao from 'navigations/avaliacao';
import CadCliente from 'operations/clientes';
import CadAvaliacao from 'operations/avaliacao';
import CadRecomendacao from 'operations/avaliacao/component/recomendacao';
import TabRoutes from 'component/table_navigation';
import LstDownloadClientes from 'navigations/cliente/lista_clientes';
import LstUsingClientes from 'navigations/cliente/clientes_baixados';
import ListCulturas from 'navigations/Cultura/lista_culturas';
import LstUsingCultura from 'navigations/Cultura/cultura_baixadas';
import Relatorio from 'operations/avaliacao/component/relatorio';

type RootStackParamList = {
  TabNavigator: any;
};

const Stack: any = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="navHome">
        <Stack.Screen
          name="cadAvaliacao"
          component={CadAvaliacao}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Cadastro da avaliação
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="cadRecomendacao"
          component={CadRecomendacao}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>Recomendação</Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="cadCliente"
          component={CadCliente}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Cadastro de Cliente
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen name="navHome" component={TabRoutes} options={{ headerShown: false }} />

        <Stack.Screen
          name="navAvaliacao"
          component={Avaliacao}
          options={({ navigation, route }: any) => {
            const params = route?.params;
            return {
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitle: () => (
                <View>
                  <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>Avaliação</Text>
                </View>
              ),
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    /// Essa condição tem como objetivo retornar para home caso a avaliação tenha sido finalizada.
                    /// Evitando que volte para as telas anteriores.
                    if (params === undefined) {
                      navigation.goBack();
                    } else {
                      navigation.navigate('navHome'); // Substitua 'Home' pelo nome da tela inicial.
                    }
                  }}
                  style={{ paddingLeft: 15 }}>
                  <View>
                    <Image
                      source={require('assets/img/Icons/back.png')}
                      style={{ margin: 8, width: 25, height: 25 }}
                    />
                  </View>
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: '#12994a', // Cor de fundo do header
              },
              headerTintColor: 'whitesmoke', // Cor do texto do título
            };
          }}
        />

        <Stack.Screen
          name="navRelatorio"
          component={Relatorio}
          options={({ navigation, route }: any) => {
            const params = route?.params;
            return {
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitle: () => (
                <View>
                  <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>Relatórios</Text>
                </View>
              ),
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    /// Essa condição tem como objetivo retornar para home caso a avaliação tenha sido finalizada.
                    /// Evitando que volte para as telas anteriores.
                    if (params === undefined) {
                      navigation.goBack();
                    } else {
                      navigation.navigate('navHome'); // Substitua 'Home' pelo nome da tela inicial.
                    }
                  }}
                  style={{ paddingLeft: 15 }}>
                  <View>
                    <Image
                      source={require('assets/img/Icons/back.png')}
                      style={{ margin: 8, width: 25, height: 25 }}
                    />
                  </View>
                </TouchableOpacity>
              ),
              headerStyle: {
                backgroundColor: '#12994a', // Cor de fundo do header
              },
              headerTintColor: 'whitesmoke', // Cor do texto do título
            };
          }}
        />

        <Stack.Screen
          name="navDownloadCliente"
          component={LstDownloadClientes}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Download de Clientes
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="navListCliente"
          component={LstUsingClientes}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Clientes à serem utilizado
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="navListCultura"
          component={ListCulturas}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Culturas à serem utilizada
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="lstCulturaBaixada"
          component={LstUsingCultura}
          options={({ navigation }: any) => ({
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitle: () => (
              <Text style={{ fontSize: 18, color: 'whitesmoke', textAlign: 'center' }}>
                Culturas utilizadas
              </Text>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Image
                  source={require('assets/img/Icons/back.png')}
                  style={{ margin: 8, width: 25, height: 25 }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigation;
