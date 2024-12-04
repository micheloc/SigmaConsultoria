import Input from 'component/Input';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import WithModal from 'component/modal';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

import { Box, Select, CheckIcon } from 'native-base';
import { BoxView, ButtonUpdate, Container, Label, LabelForm } from 'styles/boody.containers';
import { ButtonCancel, ContainerImagem, ContainerModalGalery, ContainerPhoto, Imagem } from './styles';
import { ContainerFooter } from 'component/modal/style';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchCamera } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { InputGroup } from 'operations/clientes/styles';
import { Modal, StyleSheet, View, PermissionsAndroid, Platform, Image } from 'react-native';
import { useEffect, useState } from 'react';

interface iProps {
  setFormData: (state: any) => void;
  onSubmitForm: (data: any) => void;
}

const CadAdversidades: any = WithModal(({ setFormData }: iProps) => {
  const devices: any = useCameraDevices();
  const device = devices;

  const [showGaleria, setShowGaleria] = useState<boolean>(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [adversidade, setAdversidade] = useState({
    objID: uuid.v4().toString(),
    idAvaliacao: '',
    nivel: 0,
    descricao: '',
    tipo: '',
    image: '',
  });

  useEffect(() => {
    setFormData(adversidade);
  }, [adversidade]);

  /** * Este método será utilizado para habilitar a camera.  */
  const requestPermissionCamera = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Permissão para usar a câmera',
          message: 'Precisamos da sua permissão para usar a câmera',
          buttonNeutral: 'Pergunte-me depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(device);
          handleCameraLaunch();
        } else {
          console.log('Permissão de câmera negada');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      if (result === RESULTS.GRANTED) {
        handleCameraLaunch();
      } else {
        console.log('Permissão de câmera negada');
      }
    }
  };

  const handleCameraLaunch = () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchCamera(options, (response: any) => {
      if (response.assets && response.assets.length > 0) {
        const file = response.assets[0].uri;
        RNFS.readFile(file, 'base64')
          .then((base64) => {
            setAdversidade((prev) => ({ ...prev, image: base64 }));

            setShowGaleria(false);
          })
          .catch((error) => {
            console.error('Erro ao ler o arquivo:', error);
          });
      } else {
        console.log('Nenhuma imagem selecionada');
      }
    });
  };

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
            placeholder="Nome da adversidade..."
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
        {adversidade.image === '' ? (
          <ContainerPhoto onPress={() => setShowGaleria(true)}>
            <Icon name="image" size={35} color="gray" />
          </ContainerPhoto>
        ) : (
          <ContainerImagem onPress={() => setShowGaleria(true)}>
            <Imagem
              source={{ uri: `data:image/png;base64,${adversidade.image}` }}
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
            />
          </ContainerImagem>
        )}
      </View>

      <Modal visible={showGaleria} animationType="slide" transparent>
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
              <ButtonUpdate onPress={() => requestPermissionCamera()}>
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

      {cameraVisible &&
        device && ( // Se a câmera estiver visível, exibe o componente Camera
          <Camera device={device} isActive={true} style={styles.camera} />
        )}
    </Container>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 400, // Ajuste o tamanho da câmera conforme necessário
  },
});

export default CadAdversidades;
