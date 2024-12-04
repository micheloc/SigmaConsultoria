import Input from 'component/Input';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import WithModal from 'component/modal';
import uuid from 'react-native-uuid';

import { Box, Select, CheckIcon } from 'native-base';
import { BoxView, ButtonUpdate, Container, Label, LabelForm } from 'styles/boody.containers';
import { ButtonCancel, ContainerModalGalery, ContainerPhoto } from './styles';
import { Modal, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import dimensions from 'util/adjust_size';
import { InputGroup } from 'operations/clientes/styles';
import { ContainerFooter } from 'component/modal/style';

interface iProps {
  setFormData: (state: any) => void;
  onSubmitForm: (data: any) => void;
}

const CadAdversidades: any = WithModal(({ setFormData }: iProps) => {
  const [showGaleria, setShowGaleria] = useState<boolean>(false);
  const [adversidade, setAdversidade] = useState({
    objID: uuid.v4().toString(),
    idAvaliacao: '',
    nivel: 0,
    descricao: '',
    tipo: '',
  });

  useEffect(() => {
    setFormData(adversidade);
  }, [adversidade]);

  return (
    <Container>
      <View>
        <LabelForm>Tipo de adversidade: </LabelForm>
        <Box width="100%" marginBottom="1">
          <Select
            fontSize={16}
            backgroundColor="white"
            selectedValue={adversidade.tipo}
            minWidth="200"
            accessibilityLabel="Selecione o item"
            placeholder="Selecione o item"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" color="white" marginTop={2} />,
            }}
            mt={1}
            onValueChange={(itemValue) =>
              setAdversidade((prevState) => ({ ...prevState, tipo: itemValue }))
            }>
            <Select.Item label="Invasoras" value="Invasoras" />
            <Select.Item label="Pragas" value="Pragas" />
            <Select.Item label="Doenças" value="Doenças" />
            <Select.Item label="Deficiências" value="Deficiências" />
            <Select.Item label="Injúrias" value="Injúrias" />
            <Select.Item label="Outros" value="Outros" />
          </Select>
        </Box>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: '65%' }}>
          <LabelForm>Informe o nome: </LabelForm>
          <Input
            value={adversidade.descricao}
            onChangeText={(txt: string) =>
              setAdversidade((prevState) => ({ ...prevState, descricao: txt }))
            }
          />
        </View>
        <View style={{ padding: '1%' }} />
        <View style={{ width: '33%' }}>
          <LabelForm>Nível: </LabelForm>
          <Input
            value={adversidade.nivel.toString()}
            keyboardType="numeric"
            onChangeText={(txt: string) =>
              setAdversidade((prevState: any) => ({ ...prevState, nivel: txt }))
            }
          />
        </View>
      </View>

      <View style={{ marginTop: '2%' }}>
        <LabelForm>Imagem :</LabelForm>
        <ContainerPhoto onPress={() => setShowGaleria(true)}>
          <Icon name="image" size={35} color="gray" />
        </ContainerPhoto>
      </View>

      <Modal visible={showGaleria} transparent>
        <ContainerModalGalery>
          <BoxView
            style={{
              flex: 1,
              borderColor: 'black',
              borderWidth: 2,
              borderRadius: 5,
            }}>
            <View style={{ paddingRight: 10 }}>
              <ButtonUpdate onPress={() => setShowGaleria(false)}>
                <InputGroup>
                  <MaterialIcon name="photo-camera-back" size={24} color="white" />
                  <View style={{ padding: 10 }} />
                  <Label>Galeria</Label>
                </InputGroup>
              </ButtonUpdate>
            </View>

            <View style={{ paddingRight: 10 }}>
              <ButtonUpdate onPress={() => setShowGaleria(false)}>
                <InputGroup>
                  <MaterialIcon name="add-a-photo" size={24} color="white" />
                  <View style={{ padding: 10 }} />
                  <Label>Câmera</Label>
                </InputGroup>
              </ButtonUpdate>
            </View>

            <ContainerFooter style={{ paddingRight: 9 }}>
              <ButtonCancel onPress={() => setShowGaleria(false)}>
                <Label>Fechar</Label>
              </ButtonCancel>
            </ContainerFooter>
          </BoxView>
        </ContainerModalGalery>
      </Modal>
    </Container>
  );
});

export default CadAdversidades;
