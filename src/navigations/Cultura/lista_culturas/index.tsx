import api from 'config/api';
import iCliente from 'types/interfaces/iCliente';
import moment from 'moment';
import Toast from 'react-native-toast-message';

import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Image,
  StyleSheet,
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
import iCultura from 'types/interfaces/iCultura';
import { _createCultura } from 'services/cultura_service';
import { _createFases } from 'services/fase_service';
import { _createVariedades } from 'services/variedade_service';

const ListCulturas = () => {
  const nav: any = useNavigation();
  const timestamp: number = moment.now();
  const [loading, setLoading] = useState<boolean>(false);

  const [culturas, setCulturas] = useState<iCultura[]>([]);
  const [culturaSelected, setCulturaSelected] = useState<iCultura[]>([]);
  const [nameCultura, setNameCultura] = useState<string>('');

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
    const objeto: iCultura = {
      objID: objID,
      nome: nome,
    };

    const existed = culturaSelected.filter((obj: iCultura) => obj.objID === objID)[0];

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
          onPress={() => createdCultura(objeto)}>
          <Text style={{ fontSize: 20, color: '#1B437E' }}>{nome.toUpperCase()}</Text>
        </TouchableOpacity>
      );
    }
  };

  /**
   * Este método será utilizado para carregar os dados da cultura ao banco de dados realm.db
   * @param obj refere-se ao objeto selecionado de cultura.
   */
  const createdCultura = async (obj: iCultura) => {
    try {
      setLoading(true);
      await _createCultura(obj);
      const cult: iCultura[] = [...culturaSelected];
      cult.push(obj);

      // Aqui será carregado as fases relacionada a cultura.
      const fases: any = await api.get(`/Fase/FindByCultura?idCultura=${obj.objID}`);
      if (fases.data.length > 0) {
        await _createFases(fases.data);
      }

      const variedades: any = await api.get(`/Variedade/FindByCultura?idCultura=${obj.objID}`);
      if (variedades.data.length > 0) {
        await _createVariedades(variedades.data);
      }

      setLoading(false);

      Toast.show({
        type: 'success',
        text2: `Cultura : ${obj.nome}, foi baixado com sucesso!`,
        text2Style: { fontSize: 14 },
      });
    } catch (error) {
      // Caso algo falhe, exibe o erro
      Toast.show({
        type: 'error',
        text2: 'Ocorreu algum erro ao baixar as informações da cultura.',
        text2Style: { fontSize: 14 },
      });
      console.log(error);
    }
  };

  /** * Este component será utilizado para renderizar a lista de cultura a partir de uma filtragem pela variável nameCultura.  */
  const filteredData: any = culturas.filter((item: iCultura) =>
    item.nome.toUpperCase().includes(nameCultura.toUpperCase())
  );

  useEffect(() => {
    const loading = () => {
      let realm: any = undefined;
      const initializeRealm = async () => {
        realm = await context_realm();
        const culturaCollection = realm.objects('Cultura');

        // Atualiza o estado com os dados iniciais
        setCulturaSelected([...culturaCollection]);

        // Adiciona um listener para escutar inserções e mudanças
        const listener = () => {
          setCulturaSelected([...realm.objects('Cultura')]);
        };

        culturaCollection.addListener(listener);

        // Limpa o listener quando o componente for desmontado
        return () => {
          if (culturaCollection) {
            culturaCollection.removeListener(listener);
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
        const resp = await api.get(`/Cultura`);
        if (resp.data.length > 0) {
          setCulturas(resp.data);
        }
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
            placeholder="Informe o nome da cultura..."
            onChangeText={(txt: string) => setNameCultura(txt)}
          />

          {culturaSelected.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={() => console.log('olá')}>
              <Image source={require('assets/img/Icons/Download.png')} style={styles.image} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }: any) => (
          <View style={{ marginBottom: '2%' }}>
            <Item objID={item.objID} idUser={item.idUser} nome={item.nome} />
          </View>
        )}
        keyExtractor={(item: any, index: number) => item.id || index.toString()}
      />
      <Toast />
    </Container>
  );
};

export default ListCulturas;
