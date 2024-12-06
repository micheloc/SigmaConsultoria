import sTableNavigation from 'component/style_component/containe_table_navigation';
import { Button } from './styles';
import { Container, GroupButtons, Label } from 'styles/boody.containers';
import { useNavigation } from '@react-navigation/native';
import { _getAllCultura } from 'services/cultura_service';
import { _getAllFase } from 'services/fase_service';
import { _getAllVariedades } from 'services/variedade_service';

const Cliente = () => {
  const navigation: any = useNavigation();
  return (
    <Container style={sTableNavigation.body}>
      <GroupButtons>
        <Button onPress={() => navigation.navigate('cadCliente')}>
          <Label>Cadastrar Cliente</Label>
        </Button>

        <Button onPress={() => navigation.navigate('navDownloadCliente')}>
          <Label>Download de cliente</Label>
        </Button>
      </GroupButtons>
    </Container>
  );
};

export default Cliente;
