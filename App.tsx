import React from 'react';
import Routes from './src/routes';
import { ContextProvider } from './src/context_provider';
import { NativeBaseProvider } from 'native-base';

function App() {
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
