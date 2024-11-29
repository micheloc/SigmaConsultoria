import sForm from 'component/style_component/containe_form';
import { View } from 'react-native';
import { Container, Input, LabelForm } from 'styles/boody.containers';

const CadCliente = () => {
  return (
    <Container style={sForm.body}>
      <View>
        <LabelForm>CPF/CNPJ :</LabelForm>
        <Input placeholder="CPF/CNPJd" keyboardType="number-pad" />
      </View>

      <View>
        <LabelForm>Nome :</LabelForm>
        <Input placeholder="Nome completo" />
      </View>

      <View>
        <LabelForm>E-Mail :</LabelForm>
        <Input />
      </View>
    </Container>
  );
};

export default CadCliente;
