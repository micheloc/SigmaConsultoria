import _, { uniq } from 'lodash';
import AvaliacaoModal from './component/avaliacao_modal';
import Dropdown from 'component/DropDown';

import iCliente from 'types/interfaces/iCliente';
import iCultura from 'types/interfaces/iCultura';
import iFase from 'types/interfaces/iFase';
import iFazenda from 'types/interfaces/iFazenda';
import Input from 'component/Input';
import uuid from 'react-native-uuid';
import RecomendacaoModal from './component/recomendacao_modal';

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  ButtonConf,
  ButtonEnd,
  ButtonUpdate,
  Container,
  Divider,
  Label,
  LabelForm,
} from 'styles/boody.containers';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { _findFazendaByCliente } from 'services/fazenda_service';
import { _getAllCliente } from 'services/cliente_service';
import { _findRelatorioByFazenda, _findRelatorioByFazendaAndFase } from 'services/relatorio_service';
import { iRelatorio, iRelatorioExport, iRelatorioFases } from 'types/interfaces/iRelatorio';
import { ContainerTitleArea, TextTitleArea } from 'navigations/avaliacao/style';
import { InputGroup } from 'native-base';

const Relatorio = () => {
  const nav: any = useNavigation();
  const widthScreen = Dimensions.get('screen').width;
  const heightScreen = Dimensions.get('screen').height;

  const [oCliente, setCliente] = useState<iCliente>({
    objID: uuid.v4().toString(),
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

  const [oCultura, setCultura] = useState<iCultura>({
    objID: '',
    nome: '',
  });

  const [oRelatorio, setRelatorio] = useState<iRelatorioExport | null>();

  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [fazendas, setFazendas] = useState<iFazenda[]>([]);
  const [culturas, setCulturas] = useState<iCultura[]>([]);
  const [fases, setFases] = useState<iFase[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAvaliacao, setShowAvaliacao] = useState<boolean>(false);
  const [showRecomendacao, setShowRecomendacao] = useState<boolean>(false);

  const [txtTalhoes, setTxtTalhoes] = useState<string>('');

  const [indexFase, setIndexFases] = useState<number>(1);
  const [lstFases, setLstFases] = useState<iRelatorioFases[]>([
    {
      index: indexFase,
      oFase: {
        objID: '',
        idCultura: '',
        nome: '',
        dapMedio: 0,
      },
      lst_fase: [...fases],
      relatorio: [],
      recomendacao: '',
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      const loading = async () => {
        setIsLoading(true);

        try {
          const resp: any = await _getAllCliente();
          if (resp.length > 0) {
            setClientes(resp);
          } else {
            check_cliente();
          }
        } catch (error) {
          console.log('Não foi possível carregar a lista de clientes: ', error);
          check_cliente();
        } finally {
          setIsLoading(false);
        }
      };
      loading();
    }, [])
  );

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
      const lst_cultura = [...culturas];
      const lst_fases = [...fases];

      setCulturas([]);

      const resp: any = await _findRelatorioByFazenda(oFazenda.objID);
      if (resp) {
        for (const item of resp) {
          const c: iCultura = { objID: item.idCultura, nome: item.cultura };
          lst_cultura.push(c);

          const f: iFase = { objID: item.idFase, idCultura: item.idCultura, nome: item.fase, dapMedio: 0 };
          lst_fases.push(f);
        }
      }

      const unique_cultura = _.uniqBy(lst_cultura, 'objID');
      setCulturas(unique_cultura);

      const unique_fase = _.uniqBy(lst_fases, 'objID'); // Garante que não existam duplicatas com o mesmo objID
      setFases(unique_fase);
      setLstFases((prev) =>
        prev.map((item) =>
          item.index === indexFase
            ? {
                ...item,
                lst_fase: unique_fase, // Substitui completamente o array lst_fase com unique_fase
              }
            : item
        )
      );
    };

    loading();
  }, [oFazenda]);

  useEffect(() => {
    if (oRelatorio) {
      setShowRecomendacao(true);
    }
  }, [oRelatorio]);

  /** Este component será utilizado para filtrar a lista de index da lista de fases.  */
  const fLstFases = lstFases.filter((obj) => obj.index === indexFase)[0];

  const loadingRecomendacao = async () => {
    const resp: any = await _findRelatorioByFazendaAndFase(oFazenda.objID, fLstFases.oFase.objID);

    if (resp.length > 0) {
      const unique_area: any = _.uniqBy(resp, 'idArea');
      const result = unique_area.map((item: iRelatorio) => item.area).join(', ');
      setTxtTalhoes(result);

      setShowAvaliacao(true);
    }
  };

  const check_cliente = async () => {
    Alert.alert(
      'Alerta!',
      'Nenhum cliente foi baixado para o banco interno!\nDeseja efetuar o download antes de começar este processo?',
      [
        {
          text: 'Não',
          style: 'cancel',
          onPress: () => {
            nav.navigate('navHome');
          },
        },
        {
          text: 'Sim',
          onPress: async () => {
            nav.navigate('navDownloadCliente');
          },
        },
      ]
    );
  };

  const onSubmitAvaliacao = (row: iRelatorio[]) => {
    const lst: iRelatorioExport[] = [];
    for (const x of row) {
      const obj: iRelatorioExport = {
        objID: x.objID,
        idCultura: x.idCultura,
        idFase: x.idFase,
        area: x.area,
        fase: x.fase,
        cultura: x.cultura,
        recomendacao: x.recomendacao,
      };

      lst.push(obj);
    }

    setLstFases((prev) =>
      prev.map((fase) =>
        fase.index === indexFase
          ? {
              ...fase,
              relatorio: [...fase.relatorio, ...lst], // Adiciona itens ao relatorio existente
            }
          : fase
      )
    );

    setShowAvaliacao(false);
  };

  const onSubmitRecomendacao = (row: iRelatorioExport) => {
    setLstFases((prev) =>
      prev.map((fase) =>
        fase.index === indexFase
          ? {
              ...fase,
              relatorio: fase.relatorio.map((obj) =>
                obj.objID === row.objID
                  ? { ...obj, ...row } // Substitui as propriedades do objeto com as de 'row'
                  : obj
              ),
            }
          : fase
      )
    );
    setShowRecomendacao(false);
  };

  const onRemoveRecomendacao = (row: iRelatorioExport) => {
    try {
      Alert.alert('Alerta!', `Deseja realmente remover a recomendação da lista: ${row.recomendacao} `, [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              setLstFases((prev) =>
                prev.map((fase) =>
                  fase.index === indexFase
                    ? {
                        ...fase,
                        relatorio: [...fase.relatorio.filter((obj) => obj.objID !== row.objID)], // Adiciona itens ao relatorio existente
                      }
                    : fase
                )
              );
            } catch (error) {
              console.log('Erro ao remover a variedade:', error);
            }
          },
        },
      ]);
    } catch (error) {
      console.log('Erro ao apresentar mensagem de alerta:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" animating={true} />
      </View>
    );
  }

  const FaseComponent = ({ ...props }: iRelatorioFases) => {
    console.log('olá');

    // Dentro do componente FaseComponent
    const handleChangeText = useCallback(
      (txt: string) => {
        setLstFases((prev) =>
          prev.map((item) =>
            item.index === indexFase
              ? {
                  ...item,
                  recomendacao: txt,
                }
              : item
          )
        );
      },
      [indexFase]
    );

    return (
      <View>
        {props.index > 1 && (
          <>
            <Divider style={{ backgroundColor: '#ababab', height: '0.5%' }} />

            <InputGroup>
              <View
                style={{
                  width: lstFases[0].oFase.objID !== '' && props.index === indexFase ? '50%' : '100%',
                  marginBottom: '2%',
                }}>
                <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
                <Dropdown
                  key={`dropdown-${props.index}`}
                  search={props.lst_fase.length > 0}
                  data={props.lst_fase}
                  labelField="nome"
                  valueField="objID"
                  placeholder={
                    props.lst_fase.length > 0 ? 'Selecione a fase...' : 'Nenhuma fase foi encontrada... '
                  }
                  value={
                    lstFases[props.index - 1].oFase.objID !== '' ? lstFases[props.index - 1].oFase : null
                  }
                  searchPlaceholder="Pesquisar por fazenda"
                  onChange={(item: iFase) => {
                    setLstFases((prev) =>
                      prev.map((fase) =>
                        fase.index === indexFase
                          ? {
                              ...fase,
                              oFase: { ...fase.oFase, ...item }, // Substitui as propriedades de 'oFase' com as de 'row.oFase'
                            }
                          : fase
                      )
                    );
                  }}
                />
              </View>
              {props.index === indexFase && (
                <View style={{ alignItems: 'center' }}>
                  <LabelForm style={{ marginBottom: -11 }}></LabelForm>
                  <ButtonUpdate
                    style={{ width: widthScreen / 2 - 15 }}
                    onPress={() => loadingRecomendacao()}>
                    <Label style={{ fontSize: 12 }}>Carregar Recomendacões</Label>
                  </ButtonUpdate>
                </View>
              )}
            </InputGroup>
          </>
        )}

        <View style={styles.row}>
          <>
            <Text
              style={[
                styles.cell,
                styles.headerCell,
                styles.cellSeparator,
                { maxWidth: props.index === indexFase ? '46%' : '50%' },
              ]}>
              Lavoura
            </Text>
            <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Recomendação</Text>
          </>
        </View>
        {props.relatorio.map((row: iRelatorioExport) => {
          return (
            <Fragment key={row.objID}>
              <Divider style={{ height: '-1%' }} />
              <TouchableOpacity
                onPress={() => {
                  //// Essa condição limita a edição somente ao index atual.
                  if (props.index === indexFase) {
                    setRelatorio(row);
                  }
                }}>
                <View style={styles.row}>
                  <Text style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>{row.objID}</Text>
                  <Text style={[styles.cell, styles.cellSeparator]}>{row.area}</Text>
                  <Text style={[styles.cell, styles.cellSeparator]}>{row.recomendacao}</Text>
                  {props.index === indexFase && (
                    <TouchableOpacity
                      style={{ justifyContent: 'center', alignContent: 'center' }}
                      onPress={() => onRemoveRecomendacao(row)}>
                      <Image
                        source={require('assets/img/Icons/remover.png')}
                        style={{ width: 30, height: 30, margin: 10 }}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Fragment>
          );
        })}
        {props.relatorio.length === 0 && (
          <Text style={{ color: 'red' }}>Nenhuma recomendação carregada... </Text>
        )}

        <View style={styles.containerTextArea}>
          <Input
            style={styles.textArea}
            value={fLstFases.recomendacao} // Use o valor local para o campo de texto
            onChangeText={handleChangeText}
            placeholder="Informe os dados da recomendação... "
            multiline={true}
            numberOfLines={4}
          />
        </View>
      </View>
    );
  };

  const FaseList = (): any => {
    return (
      <View>
        {lstFases.map((obj) => {
          return <FaseComponent key={uuid.v4().toString()} {...obj} />;
        })}
      </View>
    );
  };

  return (
    <Container style={{ height: heightScreen, backgroundColor: '#ccc' }}>
      <ScrollView nestedScrollEnabled={true}>
        <View>
          <LabelForm style={{ marginBottom: -5 }}>Cliente : </LabelForm>
          <Dropdown
            search={clientes.length > 0}
            data={clientes}
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
            search={fazendas.length > 0}
            data={fazendas}
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

        {oFazenda.objID && (
          <>
            <View>
              <LabelForm style={{ marginBottom: -5 }}>Cultura : </LabelForm>
              <Dropdown
                search={culturas.length > 0}
                data={culturas}
                labelField="nome"
                valueField="objID"
                placeholder={
                  culturas.length > 0 ? 'Selecione a cultura...' : 'Nenhuma cultura foi encontrada... '
                }
                searchPlaceholder="Pesquisar por cultura"
                value={oCultura}
                onChange={(item: iCultura) => {
                  setCultura(item);
                }}
              />
            </View>

            <InputGroup>
              <View style={{ width: lstFases[0].oFase.objID !== '' && indexFase === 1 ? '50%' : '100%' }}>
                <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
                <Dropdown
                  search={lstFases[0].lst_fase.length > 0}
                  data={lstFases[0].lst_fase}
                  labelField="nome"
                  valueField="objID"
                  searchPlaceholder="Pesquisar por fase"
                  placeholder={
                    lstFases[0].lst_fase.length > 0 ? 'Selecione a fase...' : 'Nenhuma fase encontrada... '
                  }
                  value={lstFases[0].oFase}
                  onChange={(item: iFase) => {
                    setLstFases((prev) =>
                      prev.map((fase) =>
                        fase.index === indexFase
                          ? {
                              ...fase,
                              oFase: { ...fase.oFase, ...item }, // Substitui as propriedades de 'oFase' com as de 'row.oFase'
                            }
                          : fase
                      )
                    );
                  }}
                />
              </View>

              {lstFases[0].oFase.objID !== '' && indexFase === 1 && (
                <View style={{ alignItems: 'center' }}>
                  <LabelForm style={{ marginBottom: -11 }}></LabelForm>
                  <ButtonUpdate
                    style={{ width: widthScreen / 2 - 15 }}
                    onPress={() => loadingRecomendacao()}>
                    <Label style={{ fontSize: 12 }}>Carregar Recomendacões</Label>
                  </ButtonUpdate>
                </View>
              )}
            </InputGroup>

            {lstFases[0].oFase.objID !== '' && (
              <View>
                <LabelForm>Talhões : </LabelForm>
                <Input
                  style={{
                    backgroundColor: '#ccc',
                    borderColor: '#ababab',
                    borderWidth: 1, // Adiciona largura para a borda
                  }}
                  maxLength={30}
                  placeholder="Talhões"
                  value={txtTalhoes}
                />
              </View>
            )}

            <View style={styles.containerList}>
              {lstFases[0].oFase.objID !== '' && (
                <>
                  <View>
                    <ContainerTitleArea style={{ width: '100%', marginLeft: -1 }}>
                      <TextTitleArea style={{ fontSize: 12 }}>Recomendações</TextTitleArea>
                    </ContainerTitleArea>
                  </View>
                  <FaseList />
                </>
              )}

              <Divider style={{ height: '0.5%' }} />

              <View style={{ width: '100%', alignItems: 'center' }}>
                <InputGroup>
                  <ButtonUpdate
                    style={{ width: widthScreen / 2 }}
                    onPress={() => {
                      let x: number = indexFase + 1;

                      setLstFases((prev) => [
                        ...prev,
                        {
                          index: x,
                          oFase: { objID: '', idCultura: '', nome: '', dapMedio: 0 },
                          lst_fase: [...fases],
                          relatorio: [],
                          recomendacao: '',
                        },
                      ]);

                      setIndexFases(x);
                    }}>
                    <Label style={{ fontSize: 12 }}>Adicionar Fase</Label>
                  </ButtonUpdate>

                  {indexFase > 1 && (
                    <ButtonEnd
                      style={{ width: widthScreen / 2 }}
                      onPress={() => {
                        setLstFases((prev) => prev.filter((obj) => obj.index !== indexFase));

                        let x: number = indexFase - 1;

                        setIndexFases(x);
                      }}>
                      <Label style={{ fontSize: 12 }}>Remover fase</Label>
                    </ButtonEnd>
                  )}
                </InputGroup>
              </View>

              <Divider style={{ height: 1 }} />
              <View style={{ width: '100%', alignItems: 'center' }}>
                <ButtonConf style={{ width: widthScreen / 2 - 45 }}>
                  <Label style={{ fontSize: 12 }}>Exportar</Label>
                </ButtonConf>
              </View>
            </View>
          </>
        )}

        <AvaliacaoModal
          visible={showAvaliacao}
          idFazenda={oFazenda.objID}
          idFase={fLstFases.oFase.objID}
          rel={lstFases
            .filter((item) => item.index === indexFase)
            .map((item) => item.relatorio)
            .flat()}
          onClose={() => {
            setShowAvaliacao(false);
          }}
          onSubmitForm={onSubmitAvaliacao}
        />

        <RecomendacaoModal
          visible={showRecomendacao}
          rel={
            lstFases
              .filter((item) => item.index === indexFase)
              .map((item) => item.relatorio)
              .flat()
              .filter((rel) => rel.objID === oRelatorio?.objID)[0]
          }
          onClose={() => {
            setRelatorio(null);
            setShowRecomendacao(false);
          }}
          onSubmitForm={onSubmitRecomendacao}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, maxHeight: 230 },
  containerTextArea: {
    flex: 1,
  },
  textArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 5,
    fontSize: 14,
    width: '100%',
    marginLeft: '-0.06%',
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#1b437e',
    minWidth: 100,
    padding: 10,
  },
  cellSeparator: {
    minWidth: 80,
    borderColor: '#ccc',
  },
  containerList: {
    padding: 6,
    paddingTop: 5,
    marginRight: 8,
    marginBottom: 5,
    maxHeight: '28%',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cell: {
    padding: 5,
    fontSize: 12,
    borderWidth: 0.5,
    flex: 1,
    fontFamily: 'roboto',
  },
});

export default Relatorio;
