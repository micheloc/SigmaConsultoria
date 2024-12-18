import Dropdown from 'component/DropDown';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Button } from 'react-native';

// Exemplo de como os props e tipos podem ser definidos:
interface iRelatorioFases {
  index: number;
  lst_fase: Array<{ nome: string; objID: number }>;
  relatorio: Array<{ objID: number; area: string; recomendacao: string }>;
}

interface iFase {
  objID: number;
  nome: string;
}

const FaseComponent = ({ index, lst_fase, relatorio }: iRelatorioFases) => {
  const [selectedFase, setSelectedFase] = useState<iFase | null>(null);
  const [relatorioState, setRelatorioState] = useState(relatorio);

  // Handler para selecionar uma fase
  const handleFaseChange = useCallback((item: iFase) => {
    setSelectedFase(item);
  }, []);

  // Função de carregamento de recomendações (exemplo)
  const loadingRecomendacao = useCallback(() => {
    console.log('Carregando recomendações...');
    // Implementar a lógica de carregamento aqui
  }, []);

  // Handler para remover recomendação
  const onRemoveRecomendacao = useCallback((row: any) => {
    setRelatorioState((prevState) => prevState.filter((item) => item.objID !== row.objID));
  }, []);

  return (
    <View>
      {index > 1 && (
        <>
          <View style={{ backgroundColor: '#ababab', height: '0.5%' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ width: '50%' }}>
              <Text>Fase:</Text>
              <Dropdown
                data={lst_fase}
                labelField="nome"
                valueField="objID"
                placeholder="Selecione a fase..."
                onChange={handleFaseChange}
              />
            </View>
            {index === 2 && (
              <View style={{ alignItems: 'center' }}>
                <Button title="Carregar Recomendacões" onPress={loadingRecomendacao} />
              </View>
            )}
          </View>
        </>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ flex: 1 }}>Lavoura</Text>
        <Text style={{ flex: 1 }}>Recomendação</Text>
      </View>

      {relatorioState.map((row) => (
        <View key={row.objID} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{row.area}</Text>
          <Text>{row.recomendacao}</Text>
          <TouchableOpacity onPress={() => onRemoveRecomendacao(row)}>
            <Image
              source={require('assets/img/Icons/remover.png')}
              style={{ width: 30, height: 30, margin: 10 }}
            />
          </TouchableOpacity>
        </View>
      ))}

      {relatorioState.length === 0 && (
        <Text style={{ color: 'red' }}>Nenhuma recomendação carregada...</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <TextInput
          style={{ borderWidth: 1, height: 100, textAlignVertical: 'top' }}
          multiline
          placeholder="Informe os dados da recomendação..."
          onChangeText={(txt) => console.log(txt)}
        />
      </View>
    </View>
  );
};

const ListFase = ({ lstFases }: { lstFases: iRelatorioFases[] }) => {
  return (
    <View>
      {lstFases.map((faseProps, index) => (
        <FaseComponent key={index} {...faseProps} />
      ))}
    </View>
  );
};

export default ListFase;
