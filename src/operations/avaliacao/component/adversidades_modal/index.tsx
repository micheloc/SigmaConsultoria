import Input from 'component/Input';
import Icon from 'react-native-vector-icons/Entypo';

import iAdversidades from 'types/interfaces/iAdversidades';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import WithModal from 'component/modal';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

import { Box, Select, CheckIcon } from 'native-base';
import { BoxView, ButtonUpdate, Container, Label, LabelForm } from 'styles/boody.containers';
import { ButtonCancel, ContainerImagem, ContainerModalGalery, ContainerPhoto, Imagem } from './styles';
import { ContainerFooter } from 'component/modal/style';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { InputGroup } from 'operations/clientes/styles';
import { Modal, StyleSheet, View, PermissionsAndroid, Platform, Image } from 'react-native';
import { useEffect, useState } from 'react';
import Avaliacao from 'navigations/avaliacao';

interface iProps {
  adv: iAdversidades;
  setFormData: (state: any) => void;
  checkRelease: (isValid: boolean) => void;
}

const CadAdversidades: any = WithModal(({ setFormData, checkRelease, adv }: iProps) => {
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
    checkedForm();
    setFormData(adversidade);
  }, [adversidade]);

  useEffect(() => {
    if (adv) {
      setAdversidade((prev) => ({
        ...prev,
        objID: adv.objID,
        idAvaliacao: adv.idAvaliacao,
        nivel: adv.nivel,
        descricao: adv.descricao,
        tipo: adv.tipo,
        image: adv.image,
      }));
    }

    return () => {
      setAdversidade((prev) => ({
        ...prev,
        objID: uuid.v4().toString(),
        idAvaliacao: '',
        nivel: 0,
        descricao: '',
        tipo: '',
        image: '',
      }));
    };
  }, []);

  /** * Este método será utilizado para autorizar que o usuário possa carregar as imagens retirada diretamente da câmera.. */
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
          handleCameraLaunch();
        } else {
          console.log('Permissão de câmera negada');
        }
      } catch (err) {
        console.warn(err);
      }
    } else if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.CAMERA);
      console.log(result);
      if (result === RESULTS.GRANTED) {
        handleCameraLaunch();
      } else if (result === RESULTS.DENIED) {
        console.log('Permissão de câmera negada');
      } else if (result === RESULTS.UNAVAILABLE) {
        console.log('Permissão de câmera indisponível');
      } else if (result === RESULTS.BLOCKED) {
        console.log('Permissão de câmera bloqueada');
      }
    }
  };

  /** * Este método será utilizado para carregar os dados referente a foto retirada pela camera. */
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

  /** * Este método será utilizado para autorizar que o usuário possa carregar as imagens da galeria.. */
  const requestPermissionGaleria = async (): Promise<void> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, // Usar essa permissão para Android 13+ (API 33)
          {
            title: 'Permissão para acessar a galeria',
            message: 'Precisamos da sua permissão para acessar a galeria de fotos',
            buttonNeutral: 'Pergunte-me depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permissão de galeria concedida');
          handleGaleriaLaunch(); // Função para abrir a galeria
        } else {
          console.log('Permissão de galeria negada');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // Para iOS, solicitamos a permissão para acessar a galeria
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY); // Permissão para acessar a galeria de fotos
      if (result === RESULTS.GRANTED) {
        handleGaleriaLaunch(); // Função para abrir a galeria
      } else {
        console.log('Permissão de galeria negada');
      }
    }
  };

  /** * Este método será utilizado para carregar os dados referente a galeria. */
  const handleGaleriaLaunch = () => {
    const options: any = {
      mediaType: 'photo', // Isso limita a seleção à tipos de mídia 'foto'
      includeBase64: false, // Definido como 'false' para evitar base64 automático
      maxHeight: 2000, // Tamanho máximo da altura da imagem
      maxWidth: 2000, // Tamanho máximo da largura da imagem
    };

    launchImageLibrary(options, async (response: any) => {
      if (response.assets && response.assets.length > 0) {
        // Acessa a URI do arquivo da primeira imagem selecionada
        const file = response.assets[0].uri;

        const base64 = await RNFS.readFile(file, 'base64');
        setAdversidade((prev) => ({ ...prev, image: base64 }));

        setShowGaleria(false);
      } else {
        console.log('Nenhuma imagem selecionada');
      }
    });
  };

  /**
   * Este método será utilizado para carregar os dados de campo númerico com as seguintes condições, duas casas decimais e limitação do campo.
   * @param text refere-se ao campo digitado.
   */
  const handleNumberChange = (text: string): void => {
    // Essa condição será utilizada para limitar o campo em somente números e pontos.
    let value = text.replace(/[^0-9.]/g, '');

    // Essa condição limita o campo em até duas casas decimais.
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }

    /// Essa condição será utilizada para validar o limite do campo até no máximo 5.
    if (parseFloat(value) > 5) {
      return;
    }

    setAdversidade((prevState: any) => ({ ...prevState, nivel: value }));
  };

  /**
   * Este método vai verificar sé todos os campos foram preenchidos.
   * @returns valor referente a validação dos campos.
   */
  const checkedForm = (): void => {
    const nivel: any = adversidade.nivel;

    /// Essa condição será utilizada para carregar os dados referente a adversidade, sendo eles os valores que não foram preenchidos.
    /// Como: tipo, descricao e nivel/ quando esses valores estiverem vazio o retorno será true, indicando que um desses campos não foi preenchido.
    if (adversidade.tipo === '' || adversidade.descricao === '' || nivel === '' || nivel === 0) {
      checkRelease(false);
    } else {
      checkRelease(true);
    }
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
            keyboardType="numeric"
            value={adversidade.nivel.toString()}
            onChangeText={(txt: string) => handleNumberChange(txt)}
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
              <ButtonUpdate onPress={() => requestPermissionGaleria()}>
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
