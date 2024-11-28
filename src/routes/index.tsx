import { ActivityIndicator, KeyboardAvoidingView, View, Platform, StatusBar } from 'react-native';
import { useState, useEffect } from 'react';
import StackLogin from './components/stack.login';

const Routes = () => {
  const [loading, setLoading] = useState(true); // Estado de carregamento para verificar o login

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {<StackLogin />}
      </KeyboardAvoidingView>
    </>
  );
};

export default Routes;
