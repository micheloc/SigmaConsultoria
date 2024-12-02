import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import CadCliente from 'operations/clientes';
import Icon from 'react-native-vector-icons/Ionicons'; // Exemplo com Ionicons
import TabRoutes from 'component/table_navigation';
import { TouchableOpacity } from 'react-native';
import LstDownloadClientes from 'navigations/cliente/list_download';
import LstUsingClientes from 'navigations/cliente/download';
import Avaliacao from 'navigations/avaliacao';
import CadAvaliacao from 'operations/avaliacao';

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
            title: 'Cadastro da avaliação',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Icon name="arrow-back" size={24} color="whitesmoke" /> {/* Ícone do botão */}
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
            title: 'Cadastro de Cliente',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Icon name="arrow-back" size={24} color="whitesmoke" /> {/* Ícone do botão */}
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
          options={({ navigation }: any) => ({
            headerShown: true,
            title: 'Avaliação',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Icon name="arrow-back" size={24} color="whitesmoke" /> {/* Ícone do botão */}
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: '#12994a', // Cor de fundo do header
            },
            headerTintColor: 'whitesmoke', // Cor do texto do título
          })}
        />

        <Stack.Screen
          name="navDownloadCliente"
          component={LstDownloadClientes}
          options={({ navigation }: any) => ({
            headerShown: true,
            title: 'Download de Clientes',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Icon name="arrow-back" size={24} color="whitesmoke" /> {/* Ícone do botão */}
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
            title: 'Clientes à serem utilizado',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
                <Icon name="arrow-back" size={24} color="whitesmoke" /> {/* Ícone do botão */}
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
