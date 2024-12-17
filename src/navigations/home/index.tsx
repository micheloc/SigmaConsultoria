import { Container, Divider, Label } from 'styles/boody.containers';
import { Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { _userLoggout } from 'services/login_service';

import sTableNavigation from 'component/style_component/containe_table_navigation';

import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

const Home = () => {
  const nav: any = useNavigation();

  const [isConected, setIsConected] = useState<boolean>(false);

  // Função que verifica a conexão inicial
  const checkConnection = async () => {
    const state: any = await NetInfo.fetch();
    setIsConected(state.isConnected);
  };

  // Usando o listener para monitorar a conectividade em tempo real
  useEffect(() => {
    // Verifica a conexão quando o componente é montado
    checkConnection();

    // Adiciona o listener para detectar mudanças na conexão
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsConected(state.isConnected); // Atualiza o estado com a nova conectividade
    });

    // Cleanup: remove o listener quando o componente for desmontado
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Container style={sTableNavigation.body}>
      <TouchableOpacity onPress={async () => nav.navigate('navAvaliacao')} style={styles.btnAvaliacao}>
        <Image
          source={require('assets/img/Icons/relatorio.png')}
          style={{ margin: 8, width: 45, height: 45 }}
        />
        <Label>Iniciar Avaliação</Label>
      </TouchableOpacity>

      {isConected && (
        <>
          <Divider />
          <TouchableOpacity
            onPress={async () => nav.navigate('navListCultura')}
            style={styles.btnAvaliacao}>
            <Image
              source={require('assets/img/Icons/Download.png')}
              style={{ margin: 8, width: 45, height: 45 }}
            />
            <Label>Download culturas</Label>
          </TouchableOpacity>
        </>
      )}

      {isConected && (
        <>
          <Divider />

          <TouchableOpacity onPress={async () => console.log('olá')} style={styles.btnAvaliacao}>
            <Image
              source={require('assets/img/Icons/Sincronizar.png')}
              style={{ margin: 8, width: 45, height: 45 }}
            />
            <Label>Sincronizar informações</Label>
            <Label>No banco de dados </Label>
          </TouchableOpacity>
        </>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  btnAvaliacao: {
    backgroundColor: '#16b95a',
    width: '50%',
    height: '20%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  txtAvaliacao: {
    fontSize: 20,
    color: '#ffffff',
  },
});

export default Home;
