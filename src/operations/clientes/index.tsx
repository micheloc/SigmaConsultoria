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

import { ButtonConf, Container, Footer, Input, Label, LabelForm } from 'styles/boody.containers';
import { Dropdown } from 'react-native-element-dropdown';
import { FlatList, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ContainerHeaderLst, Divider, InputGroup } from './styles';
import { TableArea } from './component/area_table';
import { useEffect, useState } from 'react';
import { formatCPForCNPJString } from 'util/adjust_mask';
import { _createCliente, _getAllCliente, _removeAllClientes } from 'services/cliente_service';
import { _createFazendas, _getAllFazenda, _removeAllFazendas } from 'services/fazenda_service';
import { _createAreas, _getAllArea, _removeAllArea } from 'services/area_service';
import { useNavigation } from '@react-navigation/native';

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

    console.log(oArea);

    const up_lst: iArea[] = [...lstAllAreas];
    up_lst.push(oArea);
    setLstAllAreas(up_lst);

    Toast.show({
      type: 'success',
      text1: `Área: ${obj.nome} adicionada!`,
      text1Style: { fontSize: 14 },
    });
  };

  const onSubmitFazenda = (obj: iFazenda) => {
    const fazenda: iFazenda = {
      objID: obj.objID,
      idCliente: cliente.objID,
      nome: obj.nome,
      created: obj.created,
      updated: obj.updated,
    };

    const up_lst: iFazenda[] = [...lstFazenda];
    up_lst.push(fazenda);

    setLstFazenda(up_lst);

    setShowFazendaModal(false);

    Toast.show({
      type: 'success',
      text1: `Fazenda: ${obj.nome} adicionada com sucesso!`,
      text1Style: { fontSize: 14 },
    });
  };

  const onRemoveSelectedFazenda = () => {
    const up_fazenda: iFazenda[] = lstFazenda.filter((obj: iFazenda) => obj.objID !== idFazenda);
    setLstFazenda(up_fazenda);

    const up_areas: iArea[] = lstAllAreas.filter((obj: iArea) => obj.idFazenda !== idFazenda);
    setLstAllAreas(up_areas);

    setIdFazenda('');

    Toast.show({
      type: 'success',
      text1: `Fazenda removida com sucesso!`,
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
        nome: cliente.nome,
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
      nav.navigation('navHome');
    }, 1500);
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
      <View style={{ zIndex: 35, width: '100%' }}>
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
          onChangeText={(txt: string) =>
            setCliente((prev: iCliente) => ({ ...prev, nome: txt.toUpperCase() }))
          }
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
            search
            data={lstFazenda}
            style={styles.dropdownSelect}
            maxHeight={450}
            value={idFazenda}
            labelField="nome"
            valueField="objID"
            placeholder="Informe a fazenda"
            searchPlaceholder="Pesquisar por fazenda"
            onChange={(item: iFazenda) => {
              setIdFazenda(item.objID);
            }}
          />
          <TouchableOpacity
            style={{ width: 50, height: 50, padding: 10 }}
            onPress={() => setShowFazendaModal(true)}>
            <Image
              source={require('assets/img/Icons/adicionar.png')}
              style={{ width: 30, height: 30, padding: 0 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            disabled={idFazenda === ''}
            style={{
              marginBottom: 5,
              width: 50,
              height: 50,
              paddingTop: 10,
              paddingBottom: 10,
            }}
            onPress={() => onRemoveSelectedFazenda()}>
            <Image
              source={require('assets/img/Icons/remover.png')}
              style={{ width: 30, height: 30, padding: 0 }}
            />
          </TouchableOpacity>
        </InputGroup>
      </View>

      <Divider />

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
        <ButtonConf onPress={() => onSaveCliente()}>
          <Label>Registrar Cliente</Label>
        </ButtonConf>
      </Footer>

      <AreaModal
        visible={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        onSubmitForm={onSubmitArea}
        height={dimensions.isTablet ? '26%' : '32%'}
      />

      <FazendaModal
        visible={showFazendaModal}
        onClose={() => setShowFazendaModal(false)}
        onSubmitForm={onSubmitFazenda}
        height={dimensions.isTablet ? '26%' : '32%'}
      />
    </Container>
  );
};

export default CadCliente;
