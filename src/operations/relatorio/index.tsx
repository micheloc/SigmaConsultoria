import _ from 'lodash';
import Dropdown from 'component/DropDown';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import iCliente from 'types/interfaces/iCliente';
import iCultura from 'types/interfaces/iCultura';
import iFase from 'types/interfaces/iFase';
import iFazenda from 'types/interfaces/iFazenda';
import uuid from 'react-native-uuid';

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
  TextInput,
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
  Footer,
  Label,
  LabelForm,
} from 'styles/boody.containers';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { _findFazendaByCliente } from 'services/fazenda_service';
import { _getAllCliente } from 'services/cliente_service';
import { _findRelatorioByFazenda, _findRelatorioByFazendaAndFase } from 'services/relatorio_service';
import AvaliacaoModal from './avaliacao_modal';
import iAvaliacao from 'types/interfaces/iAvaliacao';
import Input from 'component/Input';
import { background } from 'native-base/lib/typescript/theme/styled-system';
import { iRelatorio, iRelatorioExport } from 'types/interfaces/iRelatorio';
import { ContainerTitleArea, TextTitleArea } from 'navigations/avaliacao/style';
import RecomendacaoModal from './recomendacao_modal';
import { InputGroup } from 'native-base';
import { ButtonCancel } from 'component/modal/style';

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

  const [oFase, setFase] = useState<iFase>({
    objID: '',
    idCultura: '',
    nome: '',
    dapMedio: 0,
  });

  const [oRelatorio, setRelatorio] = useState<iRelatorioExport | null>();

  const [clientes, setClientes] = useState<iCliente[]>([]);
  const [fazendas, setFazendas] = useState<iFazenda[]>([]);
  const [culturas, setCulturas] = useState<iCultura[]>([]);
  const [relatorioExport, setRelatorioExport] = useState<iRelatorioExport[]>([]);
  const [fases, setFases] = useState<iFase[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAvaliacao, setShowAvaliacao] = useState<boolean>(false);
  const [showRecomendacao, setShowRecomendacao] = useState<boolean>(false);
  const [numberFases, setNumberFases] = useState<number>(1);

  const [txtTalhoes, setTxtTalhoes] = useState<string>('');

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
      setFases([]);

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

      const unique_fase = _.uniqBy(lst_fases, 'objID');
      setFases(unique_fase);
    };

    loading();
  }, [oFazenda]);

  useEffect(() => {
    if (oFase.objID) {
      loadingRecomendacao();
    }
  }, [oFase]);

  const loadingRecomendacao = async () => {
    const resp: any = await _findRelatorioByFazendaAndFase(oFazenda.objID, oFase.objID);

    if (resp.length > 0) {
      const unique_area: any = _.uniqBy(resp, 'idArea');
      const result = unique_area.map((item: iRelatorio) => item.area).join(', ');
      setTxtTalhoes(result);

      setShowAvaliacao(true);
    }
  };

  useEffect(() => {
    if (oRelatorio) {
      setShowRecomendacao(true);
    }
  }, [oRelatorio]);

  const generate = async () => {
    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Relatório Técnico</title>
          <style>
            .header {
              display: flex;
              border-bottom: 3px double rgb(204, 204, 204);
              align-items: center;
              width: 99.4%;
            }
            .header-title {
              text-align: center;
              width: 68%;
            }

            .logo-container img {
              height: 100px;
            }
            .inf-tec {
              border-bottom: 3px double rgb(204, 204, 204);
              display: flex;
              justify-content: space-between;
              padding-right: 15px;
              padding-left: 10px;
              margin-top: -10px;
              margin-bottom: -10px;
              width: 98%;
            }
            .inf-tec p {
              margin-bottom: 5px;
            }

            /* Essa configuração é referente ao titulo de identificação do relatório. */
            .identificacao {
              margin-top: 15px;
              width: 99.5%;
            }

            .identificacao table {
              width: 100%;
            }

            .tab-idenfitifacao thead tr th {
              margin: 5%;
              padding: 1%;
              background-color: #4caf50;
              text-align: left;
              color: whitesmoke;
            }

            .tab-idenfitifacao tbody tr td {
              padding-bottom: 0.7%;
            }
            #title-ident {
              background-color: rgb(233, 233, 233);
              padding: 0.4%;
              width: 10%;
            }
            #title-ident-result {
              background-color: whitesmoke;
              padding: 0.4%;
            }

            /* Essa configuração é referente ao titulo de identificação do relatório. */
            .fases {
              margin-top: 15px;
              width: 99.5%;
            }

            .fases table {
              width: 100%;
            }

            .div-fases {
              border-bottom: 3px double rgb(204, 204, 204);
              display: flex;
              margin-top: -10px;
              padding-bottom: 10px;
              width: 99.5%;
            }
            .div-fases div {
              margin-right: 0.5%;
            }

            .identificacao-fases {
              background-color: #4caf50;
              color: whitesmoke;
              text-align: left;
              width: 99.5%;
            }

            .identificacao-fases h3 {
              padding: 1%;
              margin: 0px;
              margin-top: 5px;
            }

            .tab-fase thead tr th {
              margin: 5%;
              padding: 1%;
              background-color: #4caf50;
              text-align: left;
              color: whitesmoke;
            }

            .tab-fase tbody tr td {
              padding-bottom: 0.7%;
            }
            #title-fase {
              background-color: rgb(233, 233, 233);
              padding: 0.4%;
              width: 10%;
            }
            #title-fase-lavoura {
              background-color: rgb(233, 233, 233);
              padding: 0.4%;
              width: 10%;
              text-align: center;
            }

            #title-fase-result {
              background-color: whitesmoke;
              padding: 0.4%;
            }

            .recomendacao {
              border-bottom: 3px double rgb(204, 204, 204);
              padding-bottom: 10px;
              width: 99.5%;
            }

            .recomendacao p {
              margin: 0px;
              margin-top: 5px;
              margin-left: 10px;
            }

            .identificacao-fotos {
              background-color: #4caf50;
              color: whitesmoke;
              text-align: left;
              width: 99.5%;
            }

            .identificacao-fotos h3 {
              padding: 1%;
              margin: 0px;
              margin-top: 5px;
            }

            .tab-fotos thead tr th {
              margin: 5%;
              padding: 1%;
              background-color: #4caf50;
              text-align: left;
              color: whitesmoke;
            }

            .tab-fotos tbody tr td {
              padding-bottom: 0.7%;
            }
            #fotos-lavoura {
              padding: 0.4%;
              width: 10%;
              text-align: center;
            }
            #title-fotos-lavoura {
              padding: 0.4%;
              width: 10%;
              text-align: center;
            }

            #title-fotos-result {
              background-color: whitesmoke;
              padding: 0.4%;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-container">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRquh5Ws4YDiNHcXge2ysdGNFo3oPfw7szz57lbCTOgIadtp7lwNNHCXOJW93X79bOptV0&usqp=CAU"
                alt="Logo da Empresa"
              />
            </div>
            <div class="header-title">
              <h2>Relatório de Visitas Técnicas</h2>
              <p>16/12/2024</p>
            </div>
          </div>

          <!-- Informações sobre os técnicos -->
          <div class="inf-tec">
            <div>
              <p><b>Consultor:</b> Michel</p>
            </div>
            <!-- <div>
              <p><strong>Avaliadores:</strong> José/ Wilson</p>
            </div> -->
          </div>
          <!-------------------------------------->

          <!-- Tabela de identificação -->
          <div class="identificacao">
            <table class="tab-idenfitifacao">
              <thead>
                <tr>
                  <th colspan="6">IDENTIFICAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td id="title-ident">Produtor :</td>
                  <td id="title-ident-result">Mauro Júnior Bocalon</td>

                  <td id="title-ident">Fazenda :</td>
                  <td id="title-ident-result">Fazenda catuaí cajuí</td>
                </tr>
                <tr>
                  <td id="title-ident">Talhões :</td>
                  <td id="title-ident-result" colspan="5">Fazenda caiçara é bananal</td>
                </tr>
                <tr>
                  <td id="title-ident">Cultura :</td>
                  <td id="title-ident-result" colspan="5">SOJA</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tabela de Fases -->
          <div class="identificacao-fases">
            <h3>FASE: V5</h3>
          </div>

          <div class="div-fases">
            <!-- Tabela de identificação -->
            <div class="fases">
              <table class="tab-fase">
                <tbody>
                  <!-- Aqui é carregado os valores da fase referente a lavoura selecionada. -->
                  <tr>
                    <td id="title-fase-lavoura" colspan="5"><b>Lavoura 01/ TAL :</b></td>
                  </tr>
                  <tr>
                    <td id="title-fase-result">Raizes</td>
                    <td id="title-fase-result" colspan="5">FORTE</td>
                  </tr>
                  <tr>
                    <td id="title-fase-result">Aspecto</td>
                    <td id="title-fase-result" colspan="5">ALTO</td>
                  </tr>

                  <!-- Aqui é carregado os valores da adversidades. -->

                  <tr>
                    <td id="title-fase" colspan="2"><b>Tipo</b></td>
                    <td id="title-fase" colspan="2"><b>Nome</b></td>
                    <td id="title-fase" colspan="2"><b>Nível</b></td>
                  </tr>
                  <tr>
                    <td id="title-fase-result" colspan="2">Pragas</td>
                    <td id="title-fase-result" colspan="2">Teste</td>
                    <td id="title-fase-result" colspan="2">5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabela de identificação -->
            <div class="fases">
              <table class="tab-fase">
                <tbody>
                  <!-- Aqui é carregado os valores da fase referente a lavoura selecionada. -->
                  <tr>
                    <td id="title-fase-lavoura" colspan="5"><b>Lavoura 02/ TAL :</b></td>
                  </tr>
                  <tr>
                    <td id="title-fase-result">Raizes</td>
                    <td id="title-fase-result" colspan="5">FORTE</td>
                  </tr>
                  <tr>
                    <td id="title-fase-result">Aspecto</td>
                    <td id="title-fase-result" colspan="5">ALTO</td>
                  </tr>

                  <!-- Aqui é carregado os valores da adversidades. -->

                  <tr>
                    <td id="title-fase" colspan="2"><b>Tipo</b></td>
                    <td id="title-fase" colspan="2"><b>Nome</b></td>
                    <td id="title-fase" colspan="2"><b>Nível</b></td>
                  </tr>
                  <tr>
                    <td id="title-fase-result" colspan="2">Pragas</td>
                    <td id="title-fase-result" colspan="2">Teste</td>
                    <td id="title-fase-result" colspan="2">5</td>
                  </tr>
                  <tr>
                    <td id="title-fase-result" colspan="2">Pragas</td>
                    <td id="title-fase-result" colspan="2">Teste</td>
                    <td id="title-fase-result" colspan="2">2</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Este campo será utilizado para carregar os dados da recomenação. -->
          <div class="recomendacao">
            <p><b>Recomenação : </b></p>
            <div>
              <p>Lavoura 01: Reco 1 Lavoura 02: Reco 2 Este</p>
            </div>
          </div>

          <!-- Tabela de Fases -->
          <div class="identificacao-fases">
            <h3>FOTOS</h3>
          </div>

          <div class="div-fases">
            <!-- Tabela de identificação -->
            <div class="fases">
              <table class="tab-fase">
                <tbody>
                  <!-- Aqui é carregado os valores da fase referente a lavoura selecionada. -->
                  <tr>
                    <td id="fotos-lavoura"><img src="" width="350px" height="350px" /></td>
                  </tr>
                  <tr>
                    <td id="title-fotos-lavoura"><b>TESTE (Lavoura 01)</b></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Tabela de identificação -->
            <div class="fases">
              <table class="tab-fase">
                <tbody>
                  <!-- Aqui é carregado os valores da fase referente a lavoura selecionada. -->
                  <tr>
                    <td id="fotos-lavoura"><img src="" width="350px" height="350px" /></td>
                  </tr>
                  <tr>
                    <td id="title-fotos-lavoura"><b>TESTEW (Lavoura 02)</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <footer style="margin-top: -15px; text-align: center; background-color: #f1f1f1; padding: 10px">
            <p style="font-size: 12px; margin: 0">
              Níveis: 0 a 1,0 - Muito Baixo | 1,1 a 2,0 - Baixo | 2,1 a 3,0 - Médio | 3,1 a 4,0 - Alto | 4,1 a 5,0
              - Muito alto | N+FS: Nematoides + Fungos de Solo
            </p>
          </footer>
        </body>
      </html>

    `;

    const options = {
      html,
      fileName: 'documento',
      directory: 'Documents',
      height: 842, // Altura em pontos (portrait)
      width: 595, // Largura em pontos (A4)
      orientation: 'portrait', // Retrato (ou landscape para paisagem)
    };

    const file = await RNHTMLtoPDF.convert(options);

    try {
      const options = {
        url: `file://${file.filePath}`,
        type: 'application/pdf',
        title: 'Compartilhar PDF',
      };

      try {
        await Share.open(options);
      } catch (error) {
        console.error('Erro ao compartilhar o arquivo:', error);
      }
    } catch (error) {
      console.error('Erro ao criar PDF:', error);
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
    const lst = [...relatorioExport];

    for (const x of row) {
      const obj: iRelatorioExport = {
        id: numberFases,
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

    setRelatorioExport(lst);
    setShowAvaliacao(false);
  };

  const onSubmitRecomendacao = (row: iRelatorioExport) => {
    const lst = [...relatorioExport];
    const update_lst: iRelatorioExport[] = lst.filter((item: iRelatorioExport) => item.objID !== row.objID);
    update_lst.push(row);

    setRelatorioExport(update_lst);
    setShowRecomendacao(false);
  };

  const onRemoveRecomendacao = (row: iRelatorioExport) => {
    const lst = [...relatorioExport];

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
              const update_lst: iRelatorioExport[] = lst.filter(
                (item: iRelatorioExport) => item.objID !== row.objID
              );

              setRelatorioExport(update_lst);
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

  const nFases = Array.from({ length: numberFases }, (_, index) => index + 1);

  const FaseComponent = ({ index }: any) => {
    return (
      <View>
        {index > 1 && (
          <View>
            <Divider style={{ backgroundColor: '#ababab' }} />

            <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
            <Dropdown
              key={`dropdown-${index}`}
              search={fases.length > 0}
              data={fases}
              labelField="nome"
              valueField="objID"
              placeholder={fases.length > 0 ? 'Selecione a fase...' : 'Nenhuma fase foi encontrada... '}
              searchPlaceholder="Pesquisar por fazenda"
              value={oFase}
              onChange={(item: iFase) => {
                setFase(item);
              }}
            />
          </View>
        )}

        {index === numberFases && (
          <InputGroup>
            <View>
              <ButtonUpdate
                style={{ width: widthScreen / 2, marginLeft: -1 }}
                onPress={() => loadingRecomendacao()}>
                <Label style={{ fontSize: 12 }}>Carregar Recomendacões</Label>
              </ButtonUpdate>
            </View>
            <View>
              <ButtonConf style={{ width: widthScreen / 2 - 30 }}>
                <Label style={{ fontSize: 12 }}>Nova recomendação</Label>
              </ButtonConf>
            </View>
          </InputGroup>
        )}

        <ScrollView nestedScrollEnabled={true}>
          {relatorioExport.map((row: iRelatorioExport) => {
            return (
              <Fragment key={row.objID}>
                <TouchableOpacity onPress={() => setRelatorio(row)}>
                  <View style={styles.row}>
                    <Text style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                      {row.objID}
                    </Text>
                    <Text style={[styles.cell, styles.cellSeparator]}>{row.area}</Text>
                    <Text style={[styles.cell, styles.cellSeparator]}>{row.recomendacao}</Text>
                    <TouchableOpacity
                      style={{ justifyContent: 'center', alignContent: 'center' }}
                      onPress={() => onRemoveRecomendacao(row)}>
                      <Image
                        source={require('assets/img/Icons/remover.png')}
                        style={{ width: 30, height: 30, margin: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                <Divider style={{ height: 2 }} />
              </Fragment>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const FaseList = (): any => {
    return (
      <View>
        {nFases.map((number) => {
          return <FaseComponent index={number} />;
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

            <View>
              <LabelForm style={{ marginBottom: -5 }}>Fase : </LabelForm>
              <Dropdown
                search={fases.length > 0}
                data={fases}
                labelField="nome"
                valueField="objID"
                placeholder={fases.length > 0 ? 'Selecione a fase...' : 'Nenhuma fase foi encontrada... '}
                searchPlaceholder="Pesquisar por fazenda"
                value={oFase}
                onChange={(item: iFase) => {
                  setFase(item);
                }}
              />
            </View>

            {oFase.objID && (
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
              {oFase.objID && (
                <>
                  <View>
                    <ContainerTitleArea style={{ width: '100%', marginLeft: -1 }}>
                      <TextTitleArea style={{ fontSize: 14 }}>Recomendações</TextTitleArea>
                    </ContainerTitleArea>
                  </View>
                  <FaseList />
                </>
              )}

              {relatorioExport.length > 0 && (
                <>
                  <Divider style={{ height: 1 }} />

                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <InputGroup>
                      <ButtonUpdate
                        style={{ width: widthScreen / 2 }}
                        onPress={() => {
                          let x: number = numberFases + 1;

                          setNumberFases(x);
                        }}>
                        <Label style={{ fontSize: 12 }}>Adicionar Fase</Label>
                      </ButtonUpdate>

                      {numberFases > 1 && (
                        <ButtonEnd
                          style={{ width: widthScreen / 2 }}
                          onPress={() => {
                            let x: number = numberFases - 1;

                            setNumberFases(x);
                          }}>
                          <Label style={{ fontSize: 12 }}>Remover fase</Label>
                        </ButtonEnd>
                      )}
                    </InputGroup>
                  </View>
                </>
              )}

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
          idFase={oFase.objID}
          rel={relatorioExport}
          onClose={() => {
            setShowAvaliacao(false);
          }}
          onSubmitForm={onSubmitAvaliacao}
        />

        <RecomendacaoModal
          visible={showRecomendacao}
          rel={relatorioExport.filter((item: iRelatorioExport) => item.objID === oRelatorio?.objID)[0]}
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
  textArea: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#fff',
    color: 'black',
    borderRadius: 5,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 15,
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
