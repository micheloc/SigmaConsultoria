import { View } from 'react-native';
import { Container, Input, LabelForm } from 'styles/boody.containers';

const CadCliente = () => {
  return (
    <Container>
      <View>
        <LabelForm>CPF/CNPJ :</LabelForm>
        <Input />
      </View>

      <View>
        <LabelForm>Nome :</LabelForm>
        <Input />
      </View>

      <View>
        <LabelForm>E-Mail :</LabelForm>
        <Input />
      </View>
    </Container>
  );
};

export default CadCliente;
