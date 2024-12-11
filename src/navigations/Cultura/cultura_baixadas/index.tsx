import context_realm from 'context_realm/index';
import iCultura from 'types/interfaces/iCultura';
import Input from 'component/Input';
import Toast from 'react-native-toast-message';

import { Container } from 'styles/boody.containers';

import { StyleSheet, FlatList, TouchableOpacity, View, Keyboard, Text } from 'react-native';
import { useEffect, useState } from 'react';

import { _findCultura, _removeAllCultura, _removeCultura } from 'services/cultura_service';
import { _removeAllFase, _removeFaseByCultura } from 'services/fase_service';
import { _removeAllVariedade, _removeVariedadeByCultura } from 'services/variedade_service';

const LstUsingCultura = () => {
  const [cultura, setCultura] = useState<iCultura[]>([]);
  const [nameCultura, setNameCultura] = useState<string>('');

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
    /** * Este método séra utilizado para carregar a lista de dados referente ao download de culturas. */
    const loading = () => {
      let realm: any = undefined;
      const initializeRealm = async () => {
        realm = await context_realm();
        const culturaCollection = realm.objects('Cultura');

        // Atualiza o estado com os dados iniciais
        setCultura([...culturaCollection]);

        // Adiciona um listener para escutar inserções e mudanças
        const listener = () => {
          setCultura([...realm.objects('Cultura')]);
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
          const cultura: any = await _findCultura(objID);
          setTimeout(async () => {
            await _removeFaseByCultura(cultura.objID);
          }, 650);

          setTimeout(async () => {
            await _removeVariedadeByCultura(cultura.objID);
          }, 650);

          setTimeout(async () => {
            await _removeCultura(cultura.objID);
          }, 650);

          Toast.show({
            type: 'success',
            text1: `Cultura: ${cultura.nome}, removida!`,
            text1Style: { fontSize: 12 },
          });
        }}>
        <Text style={{ fontSize: 20, color: '#1B437E' }}>{nome.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  };

  const filteredData: any = cultura.filter((item: any) =>
    item.nome.toUpperCase().includes(nameCultura.toUpperCase())
  );

  return (
    <Container style={{ backgroundColor: '#12994a' }}>
      <View style={styles.inputGroup}>
        <Input
          style={styles.input}
          placeholder="Informe o nome do cultura."
          onChangeText={(txt: string) => setNameCultura(txt)}
          onBlur={() => Keyboard.dismiss()}
        />
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

export default LstUsingCultura;
