import AuthContext from 'context_provider/index';
import StackLogin from './components/stack.login';

import { ActivityIndicator, KeyboardAvoidingView, View, Platform, StatusBar } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import StackNavigation from './components/stack.navigation';

const Routes = () => {
  const [loading, setLoading] = useState(true);

  const { isLogged, check, lAllCultura, userLogout } = useContext(AuthContext);

  // Efeito para verificar se o usuário está logado assim que o componente for montado
  useEffect(() => {
    const verifyUserLogin = async () => {
      setLoading(true); // Atualiza o estado de carregamento após o check

      await check();
      await lAllCultura();

      setLoading(false); // Atualiza o estado de carregamento após o check
    };

    verifyUserLogin();
  }, [check]);

  // Efeito para verificar a necessidade de limpar dados quando o estado de login mudar
  useEffect(() => {
    const verifyLoginStatus = async () => {
      if (!isLogged) {
        await userLogout();
      }
    };

    // Só chama remove_all depois que isLogged for atualizado e o loading for false
    if (!loading) verifyLoginStatus();
  }, [isLogged, loading]);

  // Enquanto o check não for concluído, exibe uma tela de carregamento (opcional)
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={true} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      {isLogged ? <StackNavigation /> : <StackLogin />}
    </>
  );
};

export default Routes;
