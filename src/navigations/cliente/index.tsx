import sTableNavigation from 'component/style_component/containe_table_navigation';
import { Button } from './styles';
import { Container, GroupButtons, Label } from 'styles/boody.containers';
import { useNavigation } from '@react-navigation/native';

const Cliente = () => {
  const navigation: any = useNavigation();

  return (
    <Container style={sTableNavigation.body}>
      <GroupButtons>
        <Button onPress={() => navigation('cadCliente')}>
          <Label>Cadastrar Clientes</Label>
        </Button>

        <Button>
          <Label>Download de cliente</Label>
        </Button>
      </GroupButtons>
    </Container>
  );
};

export default Cliente;
