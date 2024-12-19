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
  Keyboard,
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
import RecomendacaoGeralModal from './component/recomendacao_geral_modal';

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
  const [oRecomendacaoGeral, setRecomendacaoGeral] = useState<iRelatorioExport | null>();

  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [fazendas, setFazendas] = useState<iFazenda[]>([]);
  const [culturas, setCulturas] = useState<iCultura[]>([]);
  const [fases, setFases] = useState<iFase[]>([]);

  const [lFase, setLFase] = useState<iFase[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAvaliacao, setShowAvaliacao] = useState<boolean>(false);
  const [showRecomendacao, setShowRecomendacao] = useState<boolean>(false);
  const [showRecomendacaoGeral, setShowRecomendacaoGeral] = useState<boolean>(false);

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
      talhoes: '',
      recomendacao: '',
    },
  ]);

  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);

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

  useEffect(() => {
    if (oRecomendacaoGeral) {
      setShowRecomendacaoGeral(true);
    }
  }, [oRecomendacaoGeral]);

  /** Este component será utilizado para filtrar a lista de index da lista de fases.  */
  const fLstFases = lstFases.filter((obj) => obj.index === indexFase)[0];

  useEffect(() => {
    loading_recomendacoes();
  }, [fLstFases]);

  const loading_recomendacoes = async () => {
    let resp: any = await _findRelatorioByFazendaAndFase(oFazenda.objID, fLstFases.oFase.objID);

    if (fLstFases.relatorio.length > 0) {
      resp = resp.filter(
        (item: iRelatorioExport) =>
          !fLstFases.relatorio.some((relatorio: iRelatorioExport) => relatorio.objID === item.objID)
      );
    }

    if (resp.length > 0) {
      setRecomendacoes(resp);
    } else {
      setRecomendacoes([]);
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

  const onSubmitAvaliacao = async (row: iRelatorio[]) => {
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

    if (row.length > 0) {
      const unique_area: any = _.uniqBy(row, 'area');
      const result = unique_area.map((item: iRelatorio) => item.area).join(', ');

      // Obtém os talhões do índice correspondente
      let talhoes = lstFases.filter((obj) => obj.index === indexFase)[0].talhoes;

      if (talhoes) {
        // Se result for uma string com múltiplos itens (com vírgulas)
        const split_result = result.split(', '); // Dividindo o result em partes

        // Verificando se talhoes não contém os elementos de result
        for (const area of split_result) {
          // Se talhoes não contém o area individual, adiciona
          if (!talhoes.includes(area)) {
            talhoes = talhoes ? talhoes + ', ' + area : area; // Concatena com vírgula
          }
        }
      } else {
        // Se talhoes estiver vazio, simplesmente define o result
        talhoes = result;
      }

      // Atualiza o estado
      setLstFases((prev) =>
        prev.map((item) =>
          item.index === indexFase
            ? {
                ...item,
                talhoes: talhoes,
              }
            : item
        )
      );
    }

    loading_recomendacoes();

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

  const onSubmitRecomendacaoGeral = (reco: string) => {
    setLstFases((prev) =>
      prev.map((item) =>
        item.index === indexFase
          ? {
              ...item,
              recomendacao: reco,
            }
          : item
      )
    );
    setShowRecomendacaoGeral(false);
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
    return (
      <View>
        {props.index > 1 && (
          <>
            <Divider style={{ backgroundColor: '#ababab', height: '0.5%' }} />

            <InputGroup>
              <View
                style={{
                  width:
                    props.oFase.objID !== '' && props.index === indexFase && recomendacoes.length > 0
                      ? '50%'
                      : '100%',
                  marginBottom: '2%',
                }}>
                <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
                {props.relatorio.length > 0 ? (
                  <View>
                    <Text
                      style={{
                        backgroundColor: 'whitesmoke',
                        borderColor: '#ababab',
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: '2%',
                        marginRight: '1%',
                        marginLeft: '0.2%',
                      }}>
                      {props.oFase.nome}
                    </Text>
                  </View>
                ) : (
                  <Dropdown
                    key={`dropdown-${props.index}`}
                    search={props.lst_fase.length > 0}
                    data={props.lst_fase}
                    labelField="nome"
                    valueField="objID"
                    placeholder={
                      props.lst_fase.length > 0 ? 'Selecione a fase...' : 'Nenhuma fase foi encontrada... '
                    }
                    value={props.oFase}
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
                )}
              </View>

              {props.oFase.objID !== '' && props.index === indexFase && recomendacoes.length > 0 && (
                <View style={{ alignItems: 'center' }}>
                  <LabelForm style={{ marginBottom: -11 }}></LabelForm>
                  <ButtonUpdate
                    style={{ width: widthScreen / 2 - 15 }}
                    onPress={() => setShowAvaliacao(true)}>
                    <Label style={{ fontSize: 12 }}>Carregar Recomendacões</Label>
                  </ButtonUpdate>
                </View>
              )}
            </InputGroup>
          </>
        )}

        {props.talhoes !== '' && (
          <View>
            <LabelForm>Talhões : </LabelForm>
            <Text
              style={{
                backgroundColor: 'whitesmoke',
                borderColor: '#ababab',
                borderWidth: 1,
                borderRadius: 5,
                width: widthScreen - 20,
                marginBottom: '1%',
                padding: '2%',
              }}>
              {props.talhoes}
            </Text>
          </View>
        )}

        {props.index === 1 && (
          <View>
            <ContainerTitleArea style={{ width: '100%', marginLeft: -1 }}>
              <TextTitleArea style={{ fontSize: 12 }}>Recomendações</TextTitleArea>
            </ContainerTitleArea>
          </View>
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
          <TouchableOpacity
            onPress={() => {
              //// Essa condição limita a edição somente ao index atual.
              if (props.index === indexFase) {
                const item: iRelatorioExport = {
                  objID: uuid.v4().toString(),
                  idCultura: props.oFase.idCultura,
                  idFase: props.oFase.objID,
                  area: '',
                  fase: '',
                  cultura: '',
                  recomendacao: props.recomendacao,
                };

                setRecomendacaoGeral(item);
              }
            }}>
            <View style={styles.row}>
              {props.recomendacao !== '' ? (
                <Text style={[styles.cell, styles.cellSeparator]}>{props.recomendacao}</Text>
              ) : (
                <Text style={[styles.cell, styles.cellSeparator, { color: '#ababab', padding: '2%' }]}>
                  {'Informe a recomendação geral... '}
                </Text>
              )}
            </View>
          </TouchableOpacity>
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
          {lstFases[0].relatorio.length > 0 ? (
            <View>
              <Text
                style={{
                  backgroundColor: 'whitesmoke',
                  borderColor: '#ababab',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: '2%',
                  marginRight: '2%',
                  marginLeft: '0.8%',
                }}>
                {oCliente.nome}
              </Text>
            </View>
          ) : (
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
          )}
        </View>

        <View>
          <LabelForm style={{ marginBottom: -5 }}>Fazenda : </LabelForm>
          {lstFases[0].relatorio.length > 0 ? (
            <View>
              <Text
                style={{
                  backgroundColor: 'whitesmoke',
                  borderColor: '#ababab',
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: '2%',
                  marginRight: '2%',
                  marginLeft: '0.8%',
                }}>
                {oFazenda.nome}
              </Text>
            </View>
          ) : (
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
          )}
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
              <View
                style={{
                  width:
                    lstFases[0].oFase.objID !== '' && indexFase === 1 && recomendacoes.length > 0
                      ? '50%'
                      : '100%',
                }}>
                <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
                {lstFases[0].relatorio.length > 0 ? (
                  <View>
                    <Text
                      style={{
                        backgroundColor: 'whitesmoke',
                        borderColor: '#ababab',
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: '2%',
                        marginRight: '2%',
                        marginLeft: '0.8%',
                      }}>
                      {lstFases[0].oFase.nome}
                    </Text>
                  </View>
                ) : (
                  <Dropdown
                    search={lstFases[0].lst_fase.length > 0}
                    data={lstFases[0].lst_fase}
                    labelField="nome"
                    valueField="objID"
                    searchPlaceholder="Pesquisar por fase"
                    placeholder={
                      lstFases[0].lst_fase.length > 0
                        ? 'Selecione a fase...'
                        : 'Nenhuma fase encontrada... '
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
                )}
              </View>

              {lstFases[0].oFase.objID !== '' && indexFase === 1 && recomendacoes.length > 0 && (
                <View style={{ alignItems: 'center' }}>
                  <LabelForm style={{ marginBottom: -11 }}></LabelForm>
                  <ButtonUpdate
                    style={{ width: widthScreen / 2 - 15 }}
                    onPress={() => setShowAvaliacao(true)}>
                    <Label style={{ fontSize: 12 }}>Carregar Recomendacões</Label>
                  </ButtonUpdate>
                </View>
              )}
            </InputGroup>

            <View style={styles.containerList}>
              {lstFases[0].oFase.objID !== '' && (
                <>
                  <FaseList />
                </>
              )}

              <Divider style={{ height: '0.5%' }} />

              <View style={{ width: '100%', alignItems: 'center' }}>
                <InputGroup>
                  {fLstFases.lst_fase.length > 1 && fLstFases.relatorio.length > 0 && (
                    <ButtonUpdate
                      style={{ width: widthScreen / 2 }}
                      onPress={() => {
                        let x: number = indexFase + 1;
                        const copy_fases = _.cloneDeep(fases);

                        const copy_lst_select_fase = _.cloneDeep(lFase);
                        copy_lst_select_fase.push(fLstFases.oFase);

                        setLFase(copy_lst_select_fase);

                        const up_fases: iFase[] = _.differenceBy(copy_fases, copy_lst_select_fase, 'objID');

                        setLstFases((prev) => [
                          ...prev,
                          {
                            index: x,
                            oFase: { objID: '', idCultura: '', nome: '', dapMedio: 0 },
                            lst_fase: [...up_fases],
                            relatorio: [],
                            talhoes: '',
                            recomendacao: '',
                          },
                        ]);

                        setIndexFases(x);
                      }}>
                      <Label style={{ fontSize: 12 }}>Adicionar Fase</Label>
                    </ButtonUpdate>
                  )}

                  {indexFase > 1 && (
                    <ButtonEnd
                      style={{ width: widthScreen / 2 }}
                      onPress={() => {
                        setLstFases((prev) => prev.filter((obj) => obj.index !== indexFase));

                        if (lFase.length <= 2) {
                          setLFase([]);
                        } else {
                          setLFase((prev) => prev.filter((obj) => obj.objID !== fLstFases.oFase.objID));
                        }

                        let x: number = indexFase - 1;

                        setIndexFases(x);
                      }}>
                      <Label style={{ fontSize: 12 }}>Remover fase</Label>
                    </ButtonEnd>
                  )}
                </InputGroup>
              </View>

              {oCliente.objID !== '' &&
                oFazenda.objID !== '' &&
                oCultura.objID !== '' &&
                fLstFases.relatorio.length > 0 && (
                  <>
                    <Divider style={{ height: 1 }} />
                    <View style={{ width: '100%', alignItems: 'center' }}>
                      <ButtonConf style={{ width: widthScreen / 2 - 45 }}>
                        <Label style={{ fontSize: 12 }}>Exportar</Label>
                      </ButtonConf>
                    </View>
                  </>
                )}
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

        <RecomendacaoGeralModal
          visible={showRecomendacaoGeral}
          reco={lstFases.filter((item) => item.index === indexFase).map((item) => item.recomendacao)[0]}
          onClose={() => {
            setRecomendacaoGeral(null);
            setShowRecomendacaoGeral(false);
          }}
          onSubmitForm={onSubmitRecomendacaoGeral}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, maxHeight: 230 },
  containerTextArea: {
    flex: 1,
    marginTop: '1%',
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
