import { Container } from 'styles/boody.containers';
import { Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation: any = useNavigation();

  return (
    <Container style={{ backgroundColor: '#12994a', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => console.log('olá')} style={styles.btnAvaliacao}>
        <Image
          source={require('assets/img/Icons/relatorio.png')}
          style={{ margin: 8, width: 45, height: 45 }}
        />
        <Text style={styles.txtAvaliacao}>Iniciar Avaliação</Text>
      </TouchableOpacity>
    </Container>
  );
};

const styles = StyleSheet.create({
  btnAvaliacao: {
    backgroundColor: '#16b95a',
    width: 240,
    height: 130,
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
