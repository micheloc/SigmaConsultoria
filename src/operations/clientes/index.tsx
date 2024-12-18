import api from 'config/api';
import AreaModal from './component/area_modal';
import dimensions from 'util/adjust_size';

import iArea from 'types/interfaces/iArea';
import iCliente from 'types/interfaces/iCliente';
import iFazenda from 'types/interfaces/iFazenda';

import FazendaModal from './component/fazenda_modal';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import uuid from 'react-native-uuid';
import sForm from 'component/style_component/containe_form';
import sContainerTable from 'component/style_component/container_table';
import Toast from 'react-native-toast-message';

import { ButtonConf, Container, Footer, Label, LabelForm } from 'styles/boody.containers';
import { FlatList, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { ContainerHeaderLst, Divider } from './styles';
import { InputGroup, ScrollView } from 'native-base';
import { TableArea } from './component/area_table';
import { useEffect, useState } from 'react';
import { formatCPForCNPJString } from 'util/adjust_mask';
import { _createCliente, _getAllCliente, _removeAllClientes } from 'services/cliente_service';
import {
  _createFazendas,
  _getAllFazenda,
  _removeAllFazendas,
  _removeFazenda,
} from 'services/fazenda_service';
import { _createAreas, _getAllArea, _removeAllArea } from 'services/area_service';
import { useNavigation } from '@react-navigation/native';
import Input from 'component/Input';
import Dropdown from 'component/DropDown';

const CadCliente = () => {
  const timestamp: number = moment.now();
  const nav: any = useNavigation();

  const [cliente, setCliente] = useState<iCliente>({
    objID: uuid.v4().toString(),
    idUser: '52776b3e-850f-426c-b962-c59f16da5b23',
    nome: '',
    email: '',
    status: true,
    registro: '',
    created: new Date(timestamp),
    updated: new Date(timestamp),
  });

  const [idFazenda, setIdFazenda] = useState<string>('');

  const [lstFazenda, setLstFazenda] = useState<iFazenda[]>([]);
  const [lstAllAreas, setLstAllAreas] = useState<iArea[]>([]);
  const [lstArea, setLstArea] = useState<iArea[]>([]);

  const [showAreaModal, setShowAreaModal] = useState<boolean>(false);
  const [showFazendaModal, setShowFazendaModal] = useState<boolean>(false);

  const [isEditedFazenda, setIsEditedFazenda] = useState<boolean>(false);

  useEffect(() => {
    loadingAreas();
  }, [idFazenda]);

  useEffect(() => {
    loadingAreas();
  }, [lstAllAreas]);

  /** * Este método será utilizado para carregar as área de acordo com a seleção da fazenda. */
  const loadingAreas = () => {
    const areas = lstAllAreas.filter((obj: iArea) => obj.idFazenda == idFazenda);
    setLstArea(areas);
  };

  const onSubmitArea = (obj: iArea) => {
    const oArea: iArea = {
      objID: uuid.v4().toString(),
      idFazenda: idFazenda,
      nome: obj.nome,
      hectares: parseFloat(obj.hectares.toString()),
      created: obj.created,
      updated: obj.updated,
    };

    const up_lst: iArea[] = [...lstAllAreas];
    up_lst.push(oArea);
    setLstAllAreas(up_lst);

    Toast.show({
      type: 'success',
      text1: `Área: ${obj.nome} adicionada!`,
      text1Style: { fontSize: 14 },
    });
  };

  const onRemoveSelectedArea = (objID: string, nome: string) => {
    const up_areas: iArea[] = lstAllAreas.filter((obj: iArea) => obj.objID !== objID);
    setLstAllAreas(up_areas);
  };

  const onSaveCliente = async () => {
    await _createCliente(cliente);
    await _createFazendas(lstFazenda);
    await _createAreas(lstAllAreas);

    const net = await NetInfo.fetch();

    /// Caso o celular esteja conectado na internet, os dados serão salvos no banco de dados.
    if (net.isConnected) {
      const obj: any = {
        objID: cliente.objID,
        idUser: cliente.idUser,
        nome: cliente.nome.toUpperCase(),
        email: cliente.email,
        status: cliente.status,
        registro: cliente.registro,
        created: cliente.created,
        updated: cliente.updated,
        fazendas: lstFazenda,
        areas: lstAllAreas,
      };

      try {
        const clienteResp = await api.post('/Cliente/SaveAllCliente', JSON.stringify(obj), {
          headers: { 'Content-Type': 'application/json' },
        });

        Toast.show({
          type: 'success',
          text1: `Dados salvo no banco de dados!`,
          text1Style: { fontSize: 14 },
        });

        if (clienteResp.data.isValid) {
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    Toast.show({
      type: 'success',
      text1: `Os dados dos cliente foram registrados, com sucesso!`,
      text1Style: { fontSize: 14 },
    });

    setTimeout(() => {
      nav.navigate('navHome');
    }, 1500);
  };

  /** * Este método será utilizado para validar o campo de registro  */
  const disabled_register = (): boolean => {
    /// Essa condição séra utilizada para validar o cadastro do cliente.
    if (lstAllAreas.length === 0 || cliente.nome === '') {
      return false;
    }

    return true;
  };

  const onSubmitFazenda = (obj: iFazenda) => {
    const fazenda: iFazenda = {
      objID: obj.objID,
      idCliente: cliente.objID,
      nome: obj.nome,
      created: obj.created,
      updated: obj.updated,
    };

    let up_lst: iFazenda[] = [...lstFazenda];
    if (!isEditedFazenda) {
      up_lst.push(fazenda);
    } else {
      up_lst = up_lst.filter((item: iFazenda) => item.objID !== idFazenda);
      fazenda.objID = idFazenda;
      up_lst.push(fazenda);
    }

    setIdFazenda('');
    setLstFazenda(up_lst);
    setShowFazendaModal(false);

    Toast.show({
      type: 'success',
      text1: `Fazenda: ${obj.nome} adicionada com sucesso!`,
      text1Style: { fontSize: 14 },
    });
  };

  const edited_fazenda = () => {
    setIsEditedFazenda(true);
    setTimeout(() => {
      setShowFazendaModal(true);
    }, 500);
  };

  const onRemoveSelectedFazenda = () => {
    const item: iFazenda = lstFazenda.filter((item: iFazenda) => item.objID === idFazenda)[0];

    try {
      Alert.alert(
        'Alerta!',
        `Deseja realmente excluir a Fazenda: ${item.nome}.\nAo apagar este registro, todas as áreas vinculada será apagada.`,
        [
          {
            text: 'Não',
            style: 'cancel',
          },
          {
            text: 'Sim',
            onPress: async () => {
              try {
                const up_fazenda: iFazenda[] = lstFazenda.filter(
                  (obj: iFazenda) => obj.objID !== idFazenda
                );
                setLstFazenda(up_fazenda);

                const up_areas: iArea[] = lstAllAreas.filter((obj: iArea) => obj.idFazenda !== idFazenda);
                setLstAllAreas(up_areas);

                setIdFazenda('');

                Toast.show({
                  type: 'success',
                  text1: `Fazenda removida com sucesso!`,
                  text1Style: { fontSize: 14 },
                });
              } catch (error) {
                console.log('Erro ao remover a fase:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log('Erro ao apresentar mensagem de alerta:', error);
    }
  };

  const resize_fazenda = (): any => {
    if (idFazenda && idFazenda !== '') {
      return '72%';
    }

    return '91%';
  };

  const styles = StyleSheet.create({
    dropdownSelect: {
      marginTop: -2,
      marginLeft: 5,
      height: 45,
      width: idFazenda === '' ? '90%' : '80%',
      backgroundColor: 'white',
      borderRadius: 6,
      padding: 15,
      textAlign: 'center',
      alignItems: 'center',
      elevation: 4,
    },
  });

  return (
    <Container style={sForm.body}>
      <View style={{ zIndex: 100, width: '100%', position: 'absolute' }}>
        <Toast />
      </View>

      <View>
        <LabelForm>CPF/CNPJ :</LabelForm>
        <Input
          value={cliente.registro?.toString()}
          keyboardType="number-pad"
          placeholder="Informe seu CPF ou CNPJ..."
          maxLength={18}
          onChangeText={(txt: string) =>
            setCliente((prev: iCliente) => ({ ...prev, registro: formatCPForCNPJString(txt) }))
          }
        />
      </View>

      <View>
        <LabelForm>Nome :</LabelForm>
        <Input
          placeholder="Informe seu nome completo..."
          value={cliente.nome}
          onChangeText={(txt: string) => setCliente((prev: iCliente) => ({ ...prev, nome: txt }))}
        />
      </View>

      <View>
        <LabelForm>E-Mail :</LabelForm>
        <Input
          placeholder="Informe seu e-mail..."
          value={cliente.email?.toString()}
          onChangeText={(txt: string) => setCliente((prev: iCliente) => ({ ...prev, email: txt }))}
        />
      </View>

      <View>
        <LabelForm>Fazendas : </LabelForm>
        <InputGroup>
          <Dropdown
            search={lstFazenda.length > 0}
            data={lstFazenda}
            labelField="nome"
            valueField="objID"
            placeholder={lstFazenda.length > 0 ? 'Selecione a fase...' : 'Registre uma fazenda'}
            searchPlaceholder="Pesquisar por fase"
            style={{ width: resize_fazenda() }}
            onChange={(item: iFazenda) => {
              if (item) {
                setIdFazenda(item.objID);
              }
            }}
          />
          <TouchableOpacity
            style={{ width: 50, height: 50, padding: 10 }}
            onPress={() => setShowFazendaModal(true)}>
            <Image
              source={require('assets/img/Icons/Add.png')}
              style={{ width: 35, height: 35, padding: 0 }}
            />
          </TouchableOpacity>

          {idFazenda !== '' && (
            <>
              <TouchableOpacity onPress={() => edited_fazenda()}>
                <Image
                  source={require('assets/img/Icons/editar.png')}
                  style={{ width: 35, height: 35, margin: 8 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onRemoveSelectedFazenda()}>
                <Image
                  source={require('assets/img/Icons/remover.png')}
                  style={{ width: 35, height: 35, margin: 8 }}
                />
              </TouchableOpacity>
            </>
          )}
        </InputGroup>
      </View>

      <Divider style={{ paddingTop: 5 }} />

      <ButtonConf
        disabled={idFazenda === ''}
        style={{ backgroundColor: idFazenda === '' ? '#ccc' : '#1b437e', marginBottom: 5 }}
        onPress={() => setShowAreaModal(true)}>
        <Label>Adicionar Áreas</Label>
      </ButtonConf>

      <View>
        <ContainerHeaderLst>
          <LabelForm style={sContainerTable.formTitle}>Área</LabelForm>
          <LabelForm style={sContainerTable.formTitle}>Hectares</LabelForm>
          <LabelForm style={sContainerTable.formTitle}>{'        '}</LabelForm>
        </ContainerHeaderLst>
        <FlatList
          data={lstArea}
          keyExtractor={(item: iArea) => item.objID}
          style={{ maxHeight: '60%' }}
          renderItem={(item: any) => (
            <TableArea
              area={item.item.nome}
              key={item.item.objID}
              hectares={item.item.hectares.toString()}
              onRemove={() => onRemoveSelectedArea(item.item.objID, item.item.nome)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <LabelForm style={{ color: 'red', textAlign: 'center' }}>
              Nenhuma área cadastrada ainda!
            </LabelForm>
          )}
        />
      </View>

      <Footer>
        <ButtonConf
          disabled={!disabled_register()}
          style={{ backgroundColor: !disabled_register() ? '#ccc' : '#1b437e', marginBottom: 5 }}
          onPress={() => onSaveCliente()}>
          <Label>Registrar Cliente</Label>
        </ButtonConf>
      </Footer>

      <FazendaModal
        visible={showFazendaModal}
        fz={lstFazenda.filter((item: iFazenda) => item.objID === idFazenda)[0]}
        isEdited={isEditedFazenda}
        onClose={() => {
          setIsEditedFazenda(false);
          setShowFazendaModal(false);
        }}
        onSubmitForm={onSubmitFazenda}
      />

      <AreaModal
        visible={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onSubmitForm={onSubmitArea}
      />
    </Container>
  );
};

export default CadCliente;
