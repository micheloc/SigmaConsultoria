import sTableNavigation from 'component/style_component/containe_table_navigation';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Container, GroupButtons, Label } from 'styles/boody.containers';
import { Button } from './styles';

const Cliente = () => {
  return (
    <Container style={sTableNavigation.body}>
      <GroupButtons>
        <Button>
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
