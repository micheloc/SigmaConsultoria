import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import CadCliente from 'operations/clientes';
import Icon from 'react-native-vector-icons/Ionicons'; // Exemplo com Ionicons
import TabRoutes from 'component/table_navigation';
import { TouchableOpacity } from 'react-native';

type RootStackParamList = {
  TabNavigator: any;
};

const Stack: any = createStackNavigator<RootStackParamList>();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="navHome">
        <Stack.Screen name="navHome" component={TabRoutes} options={{ headerShown: false }} />

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigation;
