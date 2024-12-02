import iCliente from 'types/interfaces/iCliente';
import Toast from 'react-native-toast-message';
import context_realm from 'context_realm/index';

import { Container } from 'styles/boody.containers';

import {
  _findFazendaByCliente,
  _getAllFazenda,
  _removeAllFazendaByCliente,
  _removeAllFazendas,
  _removeFazenda,
} from 'services/fazenda_service';

import {
  _findAreaByFazenda,
  _getAllArea,
  _removeAllArea,
  _removeAllAreaByFazenda,
  _removeArea,
} from 'services/area_service';

import {
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  Text,
} from 'react-native';

import { _findCliente, _removeAllClientes, _removeCliente } from 'services/cliente_service';
import { useEffect, useState } from 'react';
import Input from 'component/Input';

const LstUsingClientes = () => {
  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [nameCliente, setNameCliente] = useState<string>('');

  const styles = StyleSheet.create({
    inputGroup: {
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 4,
      backgroundColor: 'whitesmoke',
    },

    buttonText: {},
  });

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
        setClientes([...clienteCollection]);

        // Adiciona um listener para escutar inserções e mudanças
        const listener = () => {
          setClientes([...realm.objects('Cliente')]);
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
  /// Apresentação da lista e seleção de dados.
  const Item = ({ objID, nome }: any) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'whitesmoke',
          width: '96%',
          padding: '2%',
          marginLeft: '2%',
        }}
        activeOpacity={0.9}
        onPress={async () => {
          const cliente: any = await _findCliente(objID);
          setTimeout(() => {
            remove_all_areas(objID);
          }, 650);

          setTimeout(() => {
            remove_all_fazenda(objID);
          }, 650);

          setTimeout(async () => {
            await _removeCliente(objID);
          }, 650);

          Toast.show({
            type: 'success',
            text2: `Os dados do cliente ${cliente.nome}, foi removido com sucesso!`,
            text2Style: { fontSize: 12 },
          });
        }}>
        <Text style={{ fontSize: 20, color: '#1B437E' }}>{nome.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Este método será utilizado para remover os dados de toda as áreas.
   * @param objID refere-se ao ID do cliente.
   */
  const remove_all_fazenda = async (objID: string) => {
    await _removeAllFazendaByCliente(objID);
  };

  /**
   * Este método será utilizado para remover os dados de toda as áreas.
   * @param objID refere-se ao ID do cliente.
   */
  const remove_all_areas = async (objID: string) => {
    const fazendas: any = await _findFazendaByCliente(objID);

    for (const fazenda of fazendas) {
      await _removeAllAreaByFazenda(fazenda.objID);
    }
  };

  const filteredData: any = clientes.filter((item: any) =>
    item.nome.toUpperCase().includes(nameCliente.toUpperCase())
  );

  return (
    <Container style={{ backgroundColor: '#12994a' }}>
      <View style={styles.inputGroup}>
        <Input
          style={styles.input}
          placeholder="Informe o nome do cliente."
          onChangeText={(txt: string) => setNameCliente(txt)}
          onBlur={() => Keyboard.dismiss()}
        />
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

export default LstUsingClientes;
