import { Container } from 'styles/boody.containers';
import { FlatList } from 'react-native';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, View, Keyboard, Text } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import iCliente from 'types/interfaces/iCliente';
import Toast from 'react-native-toast-message';

const LstUsingClientes = () => {
  const navigation: any = useNavigation();

  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [nameCliente, setNameCliente] = useState<string>('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
      marginTop: 10,
    },
    inputGroup: {
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

  /// Apresentação da lista e seleção de dados.
  const Item = ({ objID, nome }: any) => {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => remove(objID)}>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins600', color: '#1B437E' }}>
          {nome.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  /// Remove os dados do cliente na lista de dados selecionados.
  const remove = async (objID: string) => {};

  const filteredData: any = clientes.filter((item: any) =>
    item.nome.toLowerCase().includes(nameCliente.toLowerCase())
  );

  return (
    <Container style={{ backgroundColor: '#12994a' }}>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Informe o nome do cliente."
            onChangeText={(txt: string) => setNameCliente(txt)}
            onBlur={() => Keyboard.dismiss()}
          />
        </View>
      </View>

      <ScrollView>
        <FlatList
          data={filteredData}
          renderItem={({ item }: any) => <Item objID={item.objID} idUser={item.idUser} nome={item.nome} />}
          keyExtractor={(item: any, index: number) => item.id || index.toString()}
        />
      </ScrollView>
      <Toast />
    </Container>
  );
};

export default LstUsingClientes;
