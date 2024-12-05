import api from 'config/api';
import iCliente from 'types/interfaces/iCliente';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Keyboard,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';

import { Container } from 'styles/boody.containers';
import { _createCliente } from 'services/cliente_service';
import { _createFazendas } from 'services/fazenda_service';
import { _createAreas } from 'services/area_service';
import context_realm from 'context_realm/index';
import Input from 'component/Input';

const LstDownloadClientes = () => {
  const navigation: any = useNavigation();

  const timestamp: number = moment.now();

  const [loading, setLoading] = useState<boolean>(false);
  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [clienteSelect, setClienteSelect] = useState<iCliente[]>([]);
  const [nameCliente, setNameCliente] = useState<string>('');

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 10,
    },
    inputGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      backgroundColor: 'whitesmoke',
    },
    button: {
      padding: 14,
      marginLeft: 10,
      borderRadius: 5,
      backgroundColor: '#1b437e',
    },
    image: {
      width: 15,
      height: 15,
    },
  });

  /// Apresentação da lista e seleção de dados.
  const Item = ({ objID, idUser, nome }: any) => {
    const objeto: iCliente = {
      objID: objID,
      idUser: idUser,
      nome: nome,
      email: null,
      registro: null,
      status: null,
      created: new Date(timestamp),
      updated: new Date(timestamp),
    };

    const existed = clienteSelect.filter((obj: iCliente) => obj.objID === objID)[0];
    if (!existed) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: 'whitesmoke',
            width: '96%',
            padding: '2%',
            marginLeft: '2%',
          }}
          activeOpacity={0.9}
          onPress={() => createdCliente(objeto)}>
          <Text style={{ fontSize: 20, color: '#1B437E' }}>{nome.toUpperCase()}</Text>
        </TouchableOpacity>
      );
    }
  };

  /// Cria a lista de clientes
  const createdCliente = async (obj: iCliente) => {
    try {
      setLoading(true);

      // Criar cliente
      await _createCliente(obj);
      const cli: iCliente[] = [...clienteSelect];
      cli.push(obj);

      // Carregar fazendas do cliente sequencialmente
      const fazendas: any = await api.get(`/Fazenda/FindAllByClientes?objID=${obj.objID}`);
      if (fazendas.data.length > 0) {
        await _createFazendas(fazendas.data);

        try {
          for (const item of fazendas.data) {
            const areas = await api.get(`/Area/FindAllByfazenda?objID=${item.objID}`);
            await _createAreas(areas.data);
          }
        } catch (error) {
          setTimeout(() => {
            Toast.show({
              type: 'error',
              text2: `Não foi possivel baixar os dados da área!`,
              text2Style: { fontSize: 12 },
            });
          }, 500);
        }
      }

      // Atualiza a lista de clientes
      setClienteSelect(cli);
      setLoading(false);

      setTimeout(() => {
        // Exibe o toast de sucesso
        Toast.show({
          type: 'success',
          text2: `Cliente ${obj.nome}, foi baixado com sucesso!`,
          text2Style: { fontSize: 12 },
          text1Style: { fontSize: 14 },
        });
      }, 600);
    } catch (error) {
      // Caso algo falhe, exibe o erro
      Toast.show({
        type: 'error',
        text2: 'Ocorreu um erro ao processar os dados. Tente novamente.',
        text2Style: { fontSize: 12 },
        text1Style: { fontSize: 14 },
      });
      console.log(error);
    }
  };

  const filteredData: any = clientes.filter((item: any) =>
    item.nome.toLowerCase().includes(nameCliente.toLowerCase())
  );

  useEffect(() => {
    /**
     * Esse método tem como objetivo recarregar a lista todo momento em que a lista de cliente do banco interno for alterada.
     * Com o objetivo de ajustar de acordo com os que existe na lista de dados à serem utilizado com os dados do banco de dados.
     */
    const loading = () => {
      let realm: any = undefined;
      const initializeRealm = async () => {
        realm = await context_realm();
        const clienteCollection = realm.objects('Cliente');

        // Atualiza o estado com os dados iniciais
        setClienteSelect([...clienteCollection]);

        // Adiciona um listener para escutar inserções e mudanças
        const listener = () => {
          setClienteSelect([...realm.objects('Cliente')]);
        };

        clienteCollection.addListener(listener);

        // Limpa o listener quando o componente for desmontado
        return () => {
          if (clienteCollection) {
            clienteCollection.removeListener(listener);
          }
          if (realm) {
            realm.close();
          }
        };
      };

      initializeRealm();

      // Retorno opcional de limpeza
      return () => {
        if (realm) {
          realm.close();
        }
      };
    };

    loading();
  }, []);

  useEffect(() => {
    //
    const load = async () => {
      try {
        const response = await api.get(`/Cliente`);
        setClientes(response.data);
      } catch (error) {
        console.debug(error);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={true} />
      </View>
    );
  }

  return (
    <Container style={{ backgroundColor: '#12994a' }}>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Input
            style={styles.input}
            placeholder="Informe o nome do cliente."
            onChangeText={(e: string) => setNameCliente(e)}
            onBlur={() => Keyboard.dismiss()}
          />

          {clienteSelect.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('navListCliente')}>
              <Image source={require('assets/img/Icons/cliente.png')} style={styles.image} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <ScrollView>
        <FlatList
          data={filteredData}
          renderItem={({ item }: any) => (
            <View style={{ marginBottom: '2%' }}>
              <Item objID={item.objID} idUser={item.idUser} nome={item.nome} />
            </View>
          )}
          keyExtractor={(item: any, index: number) => item.id || index.toString()}
        />
      </ScrollView>
      <Toast />
    </Container>
  );
};

export default LstDownloadClientes;
