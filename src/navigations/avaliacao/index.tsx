import iArea from 'types/interfaces/iArea';
import iCliente from 'types/interfaces/iCliente';
import iFazenda from 'types/interfaces/iFazenda';
import Input from 'component/Input';

import { ContainerLstArea, ContainerTitleArea, TextTitleArea } from './style';
import { Container, Divider, LabelForm } from 'styles/boody.containers';
import { Dropdown } from 'react-native-element-dropdown';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

import { _getAllCliente } from 'services/cliente_service';
import { _findFazendaByCliente, _getAllFazenda } from 'services/fazenda_service';
import { _findAreaByFazenda, _getAllArea } from 'services/area_service';
import { useNavigation } from '@react-navigation/native';

const Avaliacao = ({ router }: any) => {
  const params = router;

  console.log(params);

  const [areas, setAreas] = useState<iArea[]>([]);
  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [fazendas, setFazendas] = useState<iFazenda[]>([]);

  const [oCliente, setCliente] = useState<iCliente>({
    objID: '',
    idUser: '',
    nome: '',
    email: '',
    status: true,
    registro: '',
    created: new Date(Date.now.toString()),
    updated: new Date(Date.now.toString()),
  });

  const [oFazenda, setFazenda] = useState<iFazenda>({
    objID: '',
    idCliente: '',
    nome: '',
    created: new Date(Date.now.toString()),
    updated: new Date(Date.now.toString()),
  });

  const nav: any = useNavigation();

  const styles = StyleSheet.create({
    dropdownSelect: {
      marginTop: 16,
      height: 55,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 15,
      textAlign: 'center',
      alignItems: 'center',
      elevation: 4,
    },
    ViewArea: {
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: 'white',
      flexDirection: 'row',
      height: 60,
      marginTop: 8,
      paddingLeft: 15,
    },
  });

  useEffect(() => {
    const loading = async () => {
      const resp: any = await _getAllCliente();
      setClientes(resp);
    };

    loading();
  }, []);

  useEffect(() => {
    const loading = async () => {
      const resp: any = await _findFazendaByCliente(oCliente.objID);
      if (resp.length > 0) {
        setFazendas(resp);
      }
    };

    loading();
  }, [oCliente]);

  useEffect(() => {
    const loading = async () => {
      try {
        const areas: any = await _findAreaByFazenda(oFazenda.objID);
        if (areas.length === 0) {
          console.warn('Nenhuma area encontrada para o idFazenda:', oFazenda.objID);
        }

        setAreas(areas);
      } catch (error) {
        console.error('Erro ao carregar areas:', error);
      }
    };
    loading();
  }, [oFazenda]);

  /// Apresentação da lista e seleção de dados.
  const Item = (obj: iArea) => {
    return (
      <ContainerLstArea>
        <View>
          <Text style={{ fontSize: 20, fontFamily: 'Poppins600', color: '#1B437E' }}>
            {obj.nome.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins600', color: '#12994a' }}>
            {`${obj.hectares} Ha`}{' '}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            nav.navigate('cadAvaliacao', {
              objID: obj.objID,
              idFazenda: oFazenda.objID,
              idCliente: oCliente.objID,
              cliente: oCliente.nome,
              fazenda: oFazenda.nome,
              area: obj.nome,
            })
          }>
          <Image
            source={require('assets/img/Icons/report.png')}
            style={{ width: 35, height: 35, marginTop: 4, marginRight: 4 }}
          />
        </TouchableOpacity>
      </ContainerLstArea>
    );
  };

  return (
    <Container style={{ backgroundColor: '#ccc' }}>
      <View style={{ padding: 5 }}>
        <View>
          <LabelForm style={{ marginBottom: -10 }}>Cliente : </LabelForm>
          <Dropdown
            style={styles.dropdownSelect}
            data={clientes}
            search
            labelField="nome"
            valueField="objID"
            placeholder="Selecione o Cliente"
            searchPlaceholder="Pesquisar por cliente"
            onChange={(item: iCliente) => {
              setCliente(item);
            }}
          />
        </View>

        <View>
          <LabelForm style={{ marginBottom: -10 }}>Fazenda : </LabelForm>
          <Dropdown
            style={styles.dropdownSelect}
            data={fazendas}
            search
            labelField="nome"
            valueField="objID"
            placeholder="Selecione a fazenda"
            searchPlaceholder="Pesquisar por fazenda"
            onChange={(item: iFazenda) => {
              setFazenda(item);
            }}
          />
        </View>

        <Divider style={{ backgroundColor: '#848484' }} />

        <View>
          <ScrollView>
            <ContainerTitleArea>
              <TextTitleArea>Área</TextTitleArea>
            </ContainerTitleArea>
            <Input placeholder="Pesquisar área" />
            <FlatList
              data={areas}
              renderItem={({ item }: any) => <Item {...item} />}
              keyExtractor={(item: any, index: number) => item.id || index.toString()}
            />
          </ScrollView>
        </View>
      </View>
    </Container>
  );
};

export default Avaliacao;
