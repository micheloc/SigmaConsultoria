import Dropdown from 'component/DropDown';
import iArea from 'types/interfaces/iArea';
import iCliente from 'types/interfaces/iCliente';
import iFazenda from 'types/interfaces/iFazenda';
import Input from 'component/Input';

import {
  ActivityIndicator,
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import { ContainerLstArea, ContainerTitleArea, Divider, List, TextTitleArea } from './style';
import { Container, LabelForm } from 'styles/boody.containers';
import { useEffect, useState } from 'react';

import { _findCliente, _getAllCliente } from 'services/cliente_service';
import { _findFazenda, _findFazendaByCliente, _getAllFazenda } from 'services/fazenda_service';
import { _findAreaByFazenda, _getAllArea } from 'services/area_service';
import { useNavigation, useRoute } from '@react-navigation/native';
import { _findAvaliacaoByArea } from 'services/avaliacao_service';
import { ScrollView } from 'native-base';

const Avaliacao = () => {
  const route = useRoute();
  const [fArea, setFArea] = useState<string>('');

  const [areas, setAreas] = useState<iArea[]>([]);
  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [fazendas, setFazendas] = useState<iFazenda[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    setIsLoading(true);
    const loading = async () => {
      try {
        const resp: any = await _getAllCliente();
        if (resp.length > 0) {
          setClientes(resp);
          setIsLoading(false);
        }
      } catch (error) {
        console.log('Não foi possivel carregar a lista de clientes : ', error);
      }
    };
    loading();
  }, []);

  useEffect(() => {
    const loading = async () => {
      if (oCliente.objID) {
        setIsLoading(true);
        try {
          const resp: any = await _findFazendaByCliente(oCliente.objID);
          if (resp.length > 0) {
            setFazendas(resp);
          } else {
            console.warn('Nenhum cliente foi localizado!');
          }
        } catch (error) {
          console.log('Não foi possivel carregar a lista de fazendas : ', error);
        }
        setIsLoading(false);
      }
    };

    loading();
  }, [oCliente]);

  useEffect(() => {
    const loading = async () => {
      try {
        if (oFazenda.objID) {
          const areas: any = await _findAreaByFazenda(oFazenda.objID);
          if (areas.length === 0) {
            console.warn('Nenhuma area encontrada para o idFazenda:', oFazenda.objID);
          }
          setAreas(areas);
        }
      } catch (error) {
        console.error('Erro ao carregar areas:', error);
      }
    };
    loading();
  }, [oFazenda]);

  useEffect(() => {
    const loadingParams = async () => {
      if (route.params !== undefined) {
        const itens: any = { ...route.params };
        if (itens.idCliente) {
          setTimeout(async () => {
            const cli: any = await _findCliente(itens.idCliente);
            setCliente(cli);
          }, 500);
        }

        if (itens.idFazenda) {
          setTimeout(async () => {
            const faz: any = await _findFazenda(itens.idFazenda);
            setFazenda(faz);
          }, 500);
        }
      }
    };

    loadingParams();
  }, [route]);

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

  const filteredData: any = areas.filter((item: iArea) =>
    item.nome.toUpperCase().includes(fArea.toUpperCase())
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={true} />
      </View>
    );
  }

  return (
    <Container style={{ backgroundColor: '#ccc' }}>
      <KeyboardAvoidingView>
        <View style={{ padding: 5 }}>
          <View>
            <LabelForm style={{ marginBottom: -5 }}>Cliente : </LabelForm>
            <Dropdown
              data={clientes}
              search
              labelField="nome"
              valueField="objID"
              placeholder="Selecione o Cliente"
              searchPlaceholder="Pesquisar por cliente"
              value={oCliente}
              onChange={(item: iCliente) => {
                setCliente(item);
              }}
            />
          </View>

          <View>
            <LabelForm style={{ marginBottom: -5 }}>Fazenda : </LabelForm>
            <Dropdown
              data={fazendas}
              search
              labelField="nome"
              valueField="objID"
              placeholder="Selecione a fazenda"
              searchPlaceholder="Pesquisar por fazenda"
              value={oFazenda}
              onChange={(item: iFazenda) => {
                setFazenda(item);
              }}
            />
          </View>

          <Divider />

          <View>
            <ContainerTitleArea>
              <TextTitleArea>Área</TextTitleArea>
            </ContainerTitleArea>
            <Input
              placeholder="Pesquisar área"
              value={fArea}
              onChangeText={(txt: string) => setFArea(txt)}
            />
            <List
              horizontal={false}
              data={filteredData}
              renderItem={({ item }: any) => <Item {...item} />}
              keyExtractor={(item: any, index: number) => item.id || index.toString()}
              contentContainerStyle={{ flexGrow: 1 }} // Garante que o FlatList ocupe o espaço restante
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default Avaliacao;
