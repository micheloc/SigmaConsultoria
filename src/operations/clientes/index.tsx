import AreaModal from './component/area_modal';
import dimensions from 'util/adjust_size';

import iArea from 'types/interfaces/iArea';
import iCliente from 'types/interfaces/iCliente';
import iFazenda from 'types/interfaces/iFazenda';

import moment from 'moment';
import uuid from 'react-native-uuid';
import sForm from 'component/style_component/containe_form';
import sContainerTable from 'component/style_component/container_table';

import { ButtonConf, Container, Footer, Input, Label, LabelForm } from 'styles/boody.containers';
import { Dropdown } from 'react-native-element-dropdown';
import { FlatList, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ContainerHeaderLst, Divider, InputGroup } from './styles';
import { TableArea } from './component/area_table';
import { useEffect, useState } from 'react';
import { Button } from 'navigations/cliente/styles';
import FazendaModal from './component/fazenda_modal';
import { formatCPForCNPJ, formatCPForCNPJString } from 'util/adjust_mask';
import { ScrollView } from 'react-native';

const CadCliente = () => {
  const timestamp: number = moment.now();

  const [cliente, setCliente] = useState<iCliente>({
    objID: uuid.v4.toString(),
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
      objID: obj.objID,
      idFazenda: idFazenda,
      nome: obj.nome,
      hectares: parseFloat(obj.hectares.toString()),
      created: obj.created,
      updated: obj.updated,
    };
    const up_lst: iArea[] = [...lstAllAreas];
    up_lst.push(oArea);
    setLstAllAreas(up_lst);
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
  };

  const onRemoveSelectedArea = (objID: string, nome: string) => {
    console.log(objID);
    console.log(nome);
  };

  return (
    <Container style={sForm.body}>
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
          onChangeText={(txt: string) =>
            setCliente((prev: iCliente) => ({ ...prev, email: txt.toUpperCase() }))
          }
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
        <ButtonConf>
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

const styles = StyleSheet.create({
  dropdownSelect: {
    marginTop: -2,
    marginLeft: 5,
    height: 45,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 15,
    textAlign: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default CadCliente;
