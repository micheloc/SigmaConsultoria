import WithModal from 'component/modal';

import { ContainerHeaderLst } from 'operations/clientes/styles';
import { Container, Divider, LabelForm } from 'styles/boody.containers';
import { useFocusEffect } from '@react-navigation/native';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { iRelatorio, iRelatorioExport } from 'types/interfaces/iRelatorio';
import { ScrollView } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { _findRelatorioByFazendaAndFase } from 'services/relatorio_service';

interface iProps {
  idFazenda: string;
  idFase: string;
  rel: iRelatorio[];
  setFormData: (state: any) => void;
  checkRelease: (isValid: boolean) => void;
}

const AvaliacaoModal: any = WithModal(({ setFormData, checkRelease, idFazenda, idFase, rel }: iProps) => {
  const [relatorio, setRelatorio] = useState<iRelatorio[]>([]);
  const [selectedRelatorio, setSelectedRelatorio] = useState<iRelatorio[]>([]); // Array de IDs selecionados

  useFocusEffect(
    useCallback(() => {
      const loading = async () => {
        let resp: any = await _findRelatorioByFazendaAndFase(idFazenda, idFase);

        if (rel.length > 0) {
          resp = resp.filter(
            (item: iRelatorioExport) =>
              !rel.some((relatorio: iRelatorioExport) => relatorio.objID === item.objID)
          );
        }

        setRelatorio(resp);
      };
      loading();
    }, [idFazenda, idFase])
  );

  const handleSelect = (obj: iRelatorio) => {
    let x: iRelatorio[] = [...selectedRelatorio];

    const filter: iRelatorio[] = x.filter((prev: iRelatorio) => prev.objID.includes(obj.objID));

    //// Nessa condição será verificado a existencia do dado, caso exista, apaga o registro.
    if (filter.length > 0) {
      const filter: iRelatorio[] = x.filter((prev: iRelatorio) => !prev.objID.includes(obj.objID));
      x = filter;
    } else {
      x.push(obj);
    }

    setSelectedRelatorio(x);
  };

  const checkedForm = (): void => {
    if (selectedRelatorio.length > 0) {
      checkRelease(true);
    } else {
      checkRelease(false);
    }
  };

  useEffect(() => {
    checkedForm();
    setFormData(selectedRelatorio);
  }, [selectedRelatorio]);

  return (
    <Container>
      <ContainerHeaderLst style={{ justifyContent: 'center', width: '100%', margin: '2%' }}>
        <LabelForm style={{ fontWeight: 'bold' }}> Recomendações</LabelForm>
      </ContainerHeaderLst>

      <View style={styles.containerList}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Talhão</Text>
          <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Cultura</Text>
          <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Fase</Text>
        </View>
        <Divider style={{ height: 2 }} />
        <ScrollView>
          {relatorio.length > 0 ? (
            relatorio.map((row: iRelatorio) => {
              const isSelected = selectedRelatorio.filter((obj: iRelatorio) =>
                obj.objID.includes(row.objID)
              )[0]; // Verifica se o item está selecionado
              return (
                <Fragment key={row.objID}>
                  <TouchableOpacity
                    onPress={() => handleSelect(row)}
                    style={[
                      isSelected && styles.selectedItem, // Aplica o estilo de item selecionado
                    ]}>
                    <View style={styles.row}>
                      <Text style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                        {row.objID}
                      </Text>
                      <Text style={[styles.cell, styles.cellSeparator]}>{row.area.toUpperCase()}</Text>
                      <Text style={[styles.cell, styles.cellSeparator]}>{row.cultura.toUpperCase()}</Text>
                      <Text style={[styles.cell, styles.cellSeparator]}>{row.fase}</Text>
                    </View>
                    <View>
                      <Text style={[styles.cell, styles.cellSeparator]}>{row.recomendacao}</Text>
                    </View>
                  </TouchableOpacity>
                  <Divider style={{ height: 2 }} />
                </Fragment>
              );
            })
          ) : (
            <View style={{ justifyContent: 'center', width: '100%' }}>
              <Text style={{ color: 'red' }}>Nenhuma recomendação encontrada!</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Container>
  );
});

const styles = StyleSheet.create({
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#1b437e',
    minWidth: 100,
    padding: 10,
  },
  cellSeparator: {
    minWidth: 80,
    borderRightWidth: 1,
    borderColor: 'rgb(180, 180, 180)',
  },
  containerList: {
    padding: 6,
    paddingTop: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    padding: 5,
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: 'rgb(180, 180, 180)',
    flex: 1,
    fontFamily: 'roboto',
  },

  selectedItem: {
    backgroundColor: '#d0ebff', // Cor de fundo para o item selecionado
  },
});

export default AvaliacaoModal;
