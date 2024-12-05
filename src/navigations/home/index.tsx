import { Container, Label } from 'styles/boody.containers';
import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sTableNavigation from 'component/style_component/containe_table_navigation';
import { _userLoggout } from 'services/login_service';

const Home = () => {
  const nav: any = useNavigation();

  return (
    <Container style={sTableNavigation.body}>
      <TouchableOpacity onPress={async () => nav.navigate('navAvaliacao')} style={styles.btnAvaliacao}>
        <Image
          source={require('assets/img/Icons/relatorio.png')}
          style={{ margin: 8, width: 45, height: 45 }}
        />
        <Label>Iniciar Avaliação</Label>
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
