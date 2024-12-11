import React, { useEffect } from 'react';
import Routes from './src/routes';
import { ContextProvider } from './src/context_provider';
import { NativeBaseProvider } from 'native-base';
import { BackHandler, Alert } from 'react-native';

function App() {
  useEffect(() => {
    const backAction = () => {
      // Alert.alert('Atenção!', 'Você realmente quer sair?', [
      //   {
      //     text: 'Não',
      //     onPress: () => null,
      //     style: 'cancel',
      //   },
      //   { text: 'Sim', onPress: () => BackHandler.exitApp() },
      // ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <>
      <ContextProvider>
        <NativeBaseProvider>
          <Routes />
        </NativeBaseProvider>
      </ContextProvider>
    </>
  );
}

export default App;
