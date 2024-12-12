import CadAdversidades from './component/adversidades_modal';
import CadEspecificos from './component/especificos_modal';
import _ from 'lodash';
import DateTimePicker from '@react-native-community/datetimepicker';
import Dropdown from 'component/DropDown';
import Input from 'component/Input';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

import iAvaliacao from 'types/interfaces/iAvaliacao';
import iAdversidades from 'types/interfaces/iAdversidades';
import iCultura from 'types/interfaces/iCultura';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';
import iFase from 'types/interfaces/iFase';
import iVariedade from 'types/interfaces/iVariedade';

import * as RNLocalize from 'react-native-localize';
import { ContainerFooter } from 'component/modal/style';
import {
  ContainerDate,
  ContainerTitleArea,
  ContainerTitles,
  ContainerTouchDate,
  TextTitleArea,
  TextTitles,
} from './style';
import { ButtonConf, Container, Divider, Label, LabelForm } from 'styles/boody.containers';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/routers';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, Platform, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';

import {
  _createVariedade,
  _findAllVariedadesByCultura,
  _findVariedades,
  _getAllVariedades,
  _removeAllVariedade,
  _removeVariedade,
  _updateVariedade,
} from 'services/variedade_service';
import {
  _createFase,
  _findAllFaseByCultura,
  _removeFase,
  _removeFaseByCultura,
  _updateFase,
} from 'services/fase_service';
import { _getAllCultura } from 'services/cultura_service';
import { InputGroup, ScrollView } from 'native-base';
import CadVariedadeCultura from './component/variedade_modal';
import api from 'config/api';
import CadFase from './component/fase_modal';

type CadAvaliacaoProps = DrawerScreenProps<ParamListBase, 'cadAvaliacao'>;

interface iParams {
  objID: string;
  idFazenda: string;
  idCliente: string;
  area: string;
  cliente: string;
  fazenda: string;
}

const CadAvaliacao: React.FC<CadAvaliacaoProps> = ({ route, navigation }: any) => {
  const params: iParams = route.params;

  const nav: any = useNavigation();

  // Obter a localidade do dispositivo (pt-BR ou outro)
  const locale = RNLocalize.getLocales()[0].languageTag;

  const timestamp = moment.now();

  const [showDate, setShowDate] = useState<boolean>(false);
  const [showAdversidades, setShowAdversidades] = useState<boolean>(false);
  const [showEspecificos, setShowEspecificos] = useState<boolean>(false);
  const [showVarieade, setShowVariedade] = useState<boolean>(false);
  const [showFase, setShowFase] = useState<boolean>(false);

  const [isEditedAdversidade, setIsEditedAdversidade] = useState<boolean>(false);
  const [isEditedEspecificacoes, setIsEditedEspecificacoes] = useState<boolean>(false);
  const [isEditedVariedade, setIsEditedVariedade] = useState<boolean>(false);
  const [isEditedFase, setIsEditedFase] = useState<boolean>(false);

  const [rowAdversidade, setRowAdversidade] = useState<iAdversidades | null>();
  const [rowEspecificacao, setRowEspecificacao] = useState<iEspecificacoes | null>();

  const [cultura, setCultura] = useState<iCultura[]>([]);
  const [variedade, setVariedade] = useState<iVariedade[]>([]);
  const [fase, setFase] = useState<iFase[]>([]);

  const [avaliacao, setAvaliacao] = useState<iAvaliacao>({
    objID: uuid.v4().toString(),
    idArea: params.objID,
    idCultura: '',
    idFase: '',
    idVariedade: '',
    avaliadores: '',
    data: new Date(timestamp),
    especificacoes: [] as iEspecificacoes[],
    adversidades: [] as iAdversidades[],
    recomendacao: '',
    pdf: [],
  });

  const changeDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDate(Platform.OS === 'ios' ? true : false);
    setAvaliacao((prevState) => ({ ...prevState, data: new Date(currentDate) }));
  };

  const check_cultura = async () => {
    Alert.alert(
      'Alerta!',
      'Nenhuma cultura foi baixado para o banco interno!\nDeseja efetuar o download antes de começar este processo?',
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
            nav.navigate('navListCultura');
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const loadingCultura = async () => {
        const resp: any = await _getAllCultura();
        if (resp.length > 0) {
          setCultura(resp);
        } else {
          check_cultura();
        }
      };

      loadingCultura();
    }, [])
  );

  useEffect(() => {
    loading_fase();
    loading_variedade();
  }, [avaliacao.idCultura]);

  /**
   * Este método será utilizado para carregar a fase.
   */
  const loading_fase = async () => {
    try {
      const result: any = await _findAllFaseByCultura(avaliacao.idCultura);
      if (result) {
        const dt: iFase[] = [];

        for (const item of result) {
          dt.push(item);
        }
        setFase(dt);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const loading_variedade = async () => {
    try {
      const response: any = await _findAllVariedadesByCultura(avaliacao.idCultura);
      if (response) {
        const dt: iVariedade[] = [];

        for (const item of response) {
          dt.push(item);
        }
        setVariedade(dt);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de adversidades.
   * @param props refere-se aos valores infomados na modal.
   */
  const onSubmitAdversidades = (props: iAdversidades) => {
    let problems: iAdversidades[] = [...avaliacao.adversidades];

    if (!isEditedAdversidade) {
      const obj = {
        objID: props.objID,
        idAvaliacao: avaliacao.objID,
        descricao: props.descricao,
        nivel: props.nivel,
        tipo: props.tipo,
        image: props.image,
      };
      problems.push(obj);

      Toast.show({
        type: 'success',
        text1: `Adversidade registrada com sucesso!`,
        text1Style: { fontSize: 14 },
      });
    } else {
      problems = problems.filter((obj: iAdversidades) => obj.objID !== props.objID);
      problems.push(props);

      Toast.show({
        type: 'success',
        text1: `Adversidade atualizada com sucesso!`,
        text1Style: { fontSize: 14 },
      });
    }

    setAvaliacao((prevState: any) => ({ ...prevState, adversidades: problems }));
    setIsEditedAdversidade(false);
    setShowAdversidades(false);
  };

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de especificações.
   * @param props refere-se aos valores informados na modal.
   */
  const onSubmitEspecificacoes = (props: iEspecificacoes) => {
    let especificacoes: iEspecificacoes[] = [...avaliacao.especificacoes];
    if (!isEditedEspecificacoes) {
      const obj: iEspecificacoes = {
        objID: props.objID,
        idAvaliacao: avaliacao.objID,
        especificacao: props.especificacao,
        descricao: props.descricao,
      };

      especificacoes.push(obj);

      Toast.show({
        type: 'success',
        text1: `Especificações registrada com sucesso!`,
        text1Style: { fontSize: 14 },
      });
    } else {
      especificacoes = especificacoes.filter((obj: iEspecificacoes) => obj.objID !== props.objID);
      especificacoes.push(props);

      Toast.show({
        type: 'success',
        text1: `Especificação atualizada com sucesso!`,
        text1Style: { fontSize: 14 },
      });
    }

    setAvaliacao((prevState: any) => ({ ...prevState, especificacoes: especificacoes }));
    setIsEditedEspecificacoes(false);
    setShowEspecificos(false);
  };

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de especificações.
   * @param props refere-se aos valores informados na modal.
   */
  const onSubmitVariedade = async (props: iVariedade) => {
    let vre: iVariedade[] = [...variedade];
    if (!isEditedVariedade) {
      const obj: iVariedade = {
        objID: uuid.v4().toString(),
        idCultura: avaliacao.idCultura,
        nome: props.nome,
      };

      await _createVariedade(obj);
      vre.push(obj);

      Toast.show({
        type: 'success',
        text1: `Fase salva!`,
        text1Style: { fontSize: 14 },
      });

      const net = await NetInfo.fetch();
      if (net.isConnected) {
        const resp = await api.post('/Variedade ', JSON.stringify(obj), {
          headers: { 'Content-Type': 'application/json' },
        });

        if (resp.data.isValid) {
          Toast.show({
            type: 'success',
            text1: `Valor salvo no banco!`,
            text1Style: { fontSize: 14 },
          });
        }
      }
    } else {
      vre = vre.filter((obj: iVariedade) => obj.objID !== avaliacao.idVariedade);
      props.objID = avaliacao.idVariedade;

      vre.push(props);
      try {
        const net = await NetInfo.fetch();
        if (net.isConnected) {
          const resp = await api.put(`/Variedade?objID=${props.objID}`, props);
          if (resp.data.isValid) {
            Toast.show({
              type: 'success',
              text1: `Valor salvo no banco!`,
              text1Style: { fontSize: 14 },
            });
          }
        }
      } catch (error: any) {
        console.log(error);
      }

      setTimeout(async () => {
        await _updateVariedade(props);
      }, 500);

      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: `Variedade atualizada!`,
          text1Style: { fontSize: 14 },
        });
      }, 1200);
    }

    setVariedade(vre);
    setShowVariedade(false);
    setIsEditedVariedade(false);
    setAvaliacao((prev) => ({ ...prev, idVariedade: '' }));
  };

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de especificações.
   * @param props refere-se aos valores informados na modal.
   */
  const onSubmitFase = async (props: iFase) => {
    let fse: iFase[] = [...fase];
    if (!isEditedFase) {
      const obj: iFase = {
        objID: uuid.v4().toString(),
        idCultura: avaliacao.idCultura,
        nome: props.nome,
        dapMedio: props.dapMedio,
      };

      await _createFase(obj);
      fse.push(obj);

      Toast.show({
        type: 'success',
        text1: `Fase salva!`,
        text1Style: { fontSize: 14 },
      });

      const net = await NetInfo.fetch();
      if (net.isConnected) {
        const resp = await api.post('/Fase ', obj, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (resp.data.isValid) {
          Toast.show({
            type: 'success',
            text1: `Valor salvo no banco!`,
            text1Style: { fontSize: 14 },
          });
        }
      }
    } else {
      fse = fse.filter((obj: iFase) => obj.objID !== avaliacao.idFase);
      props.objID = avaliacao.idFase;

      fse.push(props);

      try {
        const net = await NetInfo.fetch();
        if (net.isConnected) {
          // Tratamento de parseFloat com validação
          let dapMedio: number;
          try {
            dapMedio = parseFloat(props.dapMedio.toString());
            if (isNaN(dapMedio)) {
              throw new Error('Valor inválido para dapMedio');
            }
          } catch (error) {
            console.error('Erro ao converter dapMedio para float:', error);
            dapMedio = 0; // Valor padrão caso a conversão falhe
          }

          const fa: iFase = {
            objID: props.objID,
            idCultura: props.idCultura,
            nome: props.nome,
            dapMedio: dapMedio,
          };

          const resp = await api.put(
            `/Fase?objID=${props.objID}`, // objID como parâmetro na URL
            fa, // Corpo da requisição com os dados a serem atualizados
            {
              headers: {
                accept: 'text/plain',
                'Content-Type': 'application/json',
              },
            }
          );
          if (resp.data.isValid) {
            Toast.show({
              type: 'success',
              text1: `Valor salvo no banco!`,
              text1Style: { fontSize: 14 },
            });
          }
        }
      } catch (error: any) {
        console.log(error);
      }

      await _updateFase(props);

      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: `Fase atualizada!`,
          text1Style: { fontSize: 14 },
        });
      }, 1200);
    }

    setFase(fse);
    setShowFase(false);
    setIsEditedFase(false);
    setAvaliacao((prev) => ({ ...prev, idFase: '' }));
  };

  const checkedRelease = () => {
    if (
      avaliacao.avaliadores === '' ||
      avaliacao.idCultura === '' ||
      avaliacao.idFase === '' ||
      avaliacao.idVariedade === '' ||
      (avaliacao.adversidades.length === 0 && avaliacao.especificacoes.length === 0)
    ) {
      return false;
    }

    return true;
  };

  const edited_adversidade = (row: iAdversidades) => {
    setRowAdversidade(row);
    setIsEditedAdversidade(true);
    setTimeout(() => {
      setShowAdversidades(true);
    }, 500);
  };

  const edited_especificacao = (row: iEspecificacoes) => {
    setRowEspecificacao(row);
    setIsEditedEspecificacoes(true);
    setTimeout(() => {
      setShowEspecificos(true);
    }, 500);
  };

  const edited_fase = () => {
    setIsEditedFase(true);
    setTimeout(() => {
      setShowFase(true);
    }, 500);
  };

  const edited_variedade = () => {
    setIsEditedVariedade(true);
    setTimeout(() => {
      setShowVariedade(true);
    }, 500);
  };

  const sizeFase = (): any => {
    if (avaliacao.idCultura && avaliacao.idFase === '') {
      return '89%';
    } else if (avaliacao.idCultura && avaliacao.idFase !== '') {
      return '73%';
    }

    return '97%';
  };

  const sizeVariedade = (): any => {
    if (avaliacao.idCultura && avaliacao.idVariedade === '') {
      return '89%';
    } else if (avaliacao.idCultura && avaliacao.idVariedade !== '') {
      return '73%';
    }

    return '97%';
  };

  /** * Este método será utilizado para remover a variedade selecionada do banco de dados e do banco interno. */
  const onRemoveVariedae = async () => {
    let vre: iVariedade[] = [...variedade];
    const item: iVariedade = variedade.filter((obj: iVariedade) => obj.objID === avaliacao.idVariedade)[0];

    try {
      Alert.alert('Alerta!', `Deseja remover a fase: ${item.nome} `, [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const up_variedade: iVariedade[] = vre.filter((obj: iVariedade) => obj.objID !== item.objID);
              setVariedade(up_variedade);
              setAvaliacao((prev) => ({ ...prev, idVariedade: '' }));

              setTimeout(async () => {
                await _removeVariedade(item.objID); // Remove do banco interno
              }, 2000);

              setTimeout(() => {
                Toast.show({
                  type: 'success',
                  text1: `Variedade removida!`,
                  text1Style: { fontSize: 14 },
                });
              }, 600);
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

  /** * Este método será utilizado para remover a variedade selecionada do banco de dados e do banco interno. */
  const onRemoveFase = async () => {
    let fse: iFase[] = [...fase];
    const item: iFase = fase.filter((obj: iFase) => obj.objID === avaliacao.idFase)[0];

    try {
      Alert.alert('Alerta!', `Deseja remover a fase: ${item.nome} `, [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              const up_fase: iFase[] = fse.filter((obj: iFase) => obj.objID !== item.objID);
              setFase(up_fase);
              setAvaliacao((prev) => ({ ...prev, idFase: '' }));

              setTimeout(async () => {
                await _removeFase(item.objID); // Remove do banco interno
              }, 2000);

              setTimeout(() => {
                Toast.show({
                  type: 'success',
                  text1: `Fase removida!`,
                  text1Style: { fontSize: 14 },
                });
              }, 600);
            } catch (error) {
              console.log('Erro ao remover a fase:', error);
            }
          },
        },
      ]);
    } catch (error) {
      console.log('Erro ao apresentar mensagem de alerta:', error);
    }
  };

  const styles = StyleSheet.create({
    headerCell: {
      color: 'white',
      fontWeight: 'bold',
      backgroundColor: '#1b437e',
      minWidth: 100,
      padding: 10,
    },
    titleCell: {
      backgroundColor: '#f6f8fa',
      alignItems: 'flex-start',
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
    row: { flexDirection: 'row' },
    cell: {
      padding: 5,
      fontSize: 18,
      textAlign: 'center',
      borderWidth: 1,
      borderColor: 'rgb(180, 180, 180)',
      flex: 1,
      fontFamily: 'roboto',
    },
  });

  return (
    <Container style={{ backgroundColor: '#ccc' }}>
      <View style={{ zIndex: 100 }}>
        <Toast />
      </View>

      <ScrollView>
        <View>
          <ContainerTitles>
            <TextTitles>{params.cliente}</TextTitles>
          </ContainerTitles>
        </View>

        <View>
          <ContainerTitles>
            <TextTitles>{params.fazenda}</TextTitles>
          </ContainerTitles>
        </View>

        <View>
          <ContainerTitleArea>
            <TextTitleArea>{params.area}</TextTitleArea>
          </ContainerTitleArea>
        </View>

        <Divider style={{ backgroundColor: '#848484' }} />

        <View>
          <LabelForm>Avaliadores : </LabelForm>
          <Input
            placeholder="Informe o nome dos avaliadores..."
            value={avaliacao.avaliadores}
            onChangeText={(txt: string) => setAvaliacao((prev) => ({ ...prev, avaliadores: txt }))}
          />
        </View>

        <View>
          <LabelForm>Data da avaliação : </LabelForm>

          <ContainerDate>
            <ContainerTouchDate onPress={() => setShowDate(true)}>
              <Text>{avaliacao.data.toLocaleDateString()}</Text>
            </ContainerTouchDate>

            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                themeVariant="dark"
                value={avaliacao.data}
                mode="date"
                display="default"
                locale={locale} // Passar a localidade pt-BR ou a localidade do dispositivo
                onChange={changeDate}
              />
            )}
          </ContainerDate>
        </View>

        <View>
          <LabelForm>Cultura : </LabelForm>
          <Dropdown
            search
            data={cultura}
            labelField="nome"
            valueField="objID"
            placeholder="Selecione a cultura..."
            searchPlaceholder="Pesquisar por cultura"
            onChange={(item: iCultura) => {
              setAvaliacao((prevState) => ({ ...prevState, idCultura: item.objID }));
            }}
          />
        </View>

        {avaliacao.idCultura !== '' && (
          <>
            <View>
              <LabelForm>Fase : </LabelForm>
              <InputGroup>
                <Dropdown
                  search={fase.length > 0}
                  data={fase}
                  labelField="nome"
                  valueField="objID"
                  placeholder="Selecione a fase..."
                  searchPlaceholder="Pesquisar por fase"
                  style={{ width: sizeFase() }}
                  onChange={(item: any) => {
                    if (item) {
                      setAvaliacao((prevState) => ({ ...prevState, idFase: item.objID }));
                    }
                  }}
                />
                <TouchableOpacity onPress={() => setShowFase(true)}>
                  <Image
                    source={require('assets/img/Icons/Add.png')}
                    style={{ width: 40, height: 40, margin: 5, marginLeft: 10 }}
                  />
                </TouchableOpacity>

                {avaliacao.idFase !== '' && (
                  <TouchableOpacity onPress={() => edited_fase()}>
                    <Image
                      source={require('assets/img/Icons/editar.png')}
                      style={{ width: 40, height: 40, margin: 5 }}
                    />
                  </TouchableOpacity>
                )}

                {avaliacao.idFase !== '' && (
                  <TouchableOpacity onPress={() => onRemoveFase()}>
                    <Image
                      source={require('assets/img/Icons/remover.png')}
                      style={{ width: 40, height: 40, margin: 5 }}
                    />
                  </TouchableOpacity>
                )}
              </InputGroup>
            </View>

            <View>
              <LabelForm>Variedade : </LabelForm>
              <InputGroup>
                <Dropdown
                  search={variedade.length > 0}
                  data={variedade}
                  labelField="nome"
                  valueField="objID"
                  placeholder={
                    variedade.length > 0 ? 'Selecione a variedade...' : 'Registre uma variedade...'
                  }
                  searchPlaceholder="Pesquisar por variedade"
                  style={{ width: sizeVariedade() }}
                  onChange={(item: any) => {
                    if (item) {
                      setAvaliacao((prevState) => ({ ...prevState, idVariedade: item.objID }));
                    }
                  }}
                />
                <TouchableOpacity onPress={() => setShowVariedade(true)}>
                  <Image
                    source={require('assets/img/Icons/Add.png')}
                    style={{ width: 40, height: 40, margin: 5, marginLeft: 10 }}
                  />
                </TouchableOpacity>

                {avaliacao.idVariedade !== '' && (
                  <TouchableOpacity onPress={() => edited_variedade()}>
                    <Image
                      source={require('assets/img/Icons/editar.png')}
                      style={{ width: 40, height: 40, margin: 5 }}
                    />
                  </TouchableOpacity>
                )}

                {avaliacao.idVariedade !== '' && (
                  <TouchableOpacity onPress={() => onRemoveVariedae()}>
                    <Image
                      source={require('assets/img/Icons/remover.png')}
                      style={{ width: 40, height: 40, margin: 5 }}
                    />
                  </TouchableOpacity>
                )}
              </InputGroup>
            </View>

            <Divider style={{ backgroundColor: '#848484', marginTop: 20 }} />

            <View>
              <ButtonConf onPress={() => setShowEspecificos(true)}>
                <Label>Adicionar especificos</Label>
              </ButtonConf>

              {avaliacao.especificacoes.length > 0 && (
                <View style={styles.containerList}>
                  <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins600' }}> Especificações </Text>
                  </View>
                  <View style={styles.row}>
                    <>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Tipo</Text>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>
                        Especificação
                      </Text>
                    </>
                  </View>
                  {avaliacao.especificacoes.map((row: iEspecificacoes) => {
                    return (
                      <TouchableOpacity
                        key={uuid.v4().toString()}
                        onPress={() => edited_especificacao(row)}>
                        <View key={uuid.v4.toString()} style={styles.row}>
                          <Text
                            key={uuid.v4().toString()}
                            style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                            {row.objID}
                          </Text>
                          <Text
                            key={uuid.v4().toString()}
                            style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                            {row.idAvaliacao}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.descricao}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.especificacao}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <Divider style={{ backgroundColor: '#848484', marginTop: 20 }} />

            <View>
              <ButtonConf onPress={() => setShowAdversidades(true)}>
                <Label>Adicionar adversidades</Label>
              </ButtonConf>

              {avaliacao.adversidades.length > 0 && (
                <View style={styles.containerList}>
                  <View style={{ alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins600' }}> Adversidades </Text>
                  </View>
                  <View style={styles.row}>
                    <>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Tipo</Text>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Nome</Text>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Nível</Text>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>Foto</Text>
                    </>
                  </View>
                  {avaliacao.adversidades.map((row: iAdversidades) => {
                    return (
                      <TouchableOpacity onPress={() => edited_adversidade(row)}>
                        <View key={row.objID} style={styles.row}>
                          <Text
                            key={uuid.v4().toString()}
                            style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                            {row.objID}
                          </Text>
                          <Text
                            key={uuid.v4().toString()}
                            style={[styles.cell, styles.cellSeparator, { display: 'none' }]}>
                            {row.idAvaliacao}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.tipo.toUpperCase()}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.descricao.toUpperCase()}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.nivel}
                          </Text>
                          <Text key={uuid.v4().toString()} style={[styles.cell, styles.cellSeparator]}>
                            {row.image ? '✅' : '❌'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <CadAdversidades
        visible={showAdversidades}
        adv={rowAdversidade}
        onClose={() => {
          setRowAdversidade(null);
          setIsEditedAdversidade(false);
          setShowAdversidades(false);
        }}
        onSubmitForm={onSubmitAdversidades}
      />

      <CadEspecificos
        visible={showEspecificos}
        esp={rowEspecificacao}
        onClose={() => {
          setRowEspecificacao(null);
          setShowEspecificos(false);
          setIsEditedEspecificacoes(false);
        }}
        onSubmitForm={onSubmitEspecificacoes}
      />

      <CadFase
        visible={showFase}
        isEdited={isEditedFase}
        fs={fase.filter((item: iFase) => item.objID === avaliacao.idFase)[0]}
        onClose={() => {
          setShowFase(false);
          setIsEditedFase(false);
        }}
        onSubmitForm={onSubmitFase}
      />

      <CadVariedadeCultura
        visible={showVarieade}
        isEdited={isEditedVariedade}
        vari={variedade.filter((item: iVariedade) => item.objID === avaliacao.idVariedade)[0]}
        onClose={() => {
          setShowVariedade(false);
          setIsEditedVariedade(false);
        }}
        onSubmitForm={onSubmitVariedade}
      />

      <ContainerFooter style={{ padding: 5 }}>
        <ButtonConf
          disabled={!checkedRelease()}
          style={{
            backgroundColor: !checkedRelease() ? '#ccc' : '#1b437e',
            borderColor: !checkedRelease() ? 'whitesmoke' : '#1b437e',
            borderWidth: 1,
          }}
          onPress={() => {
            const sanitizedAvaliacao = {
              ...avaliacao,
              idCliente: params.idCliente,
              idFazenda: params.idFazenda,
              pdf: avaliacao.pdf || null,
              data: avaliacao.data ? avaliacao.data.toISOString() : null, // Converter `Date` para string
            };

            nav.navigate('cadRecomendacao', {
              ...sanitizedAvaliacao,
            });
          }}>
          <Label>Avançar</Label>
        </ButtonConf>
      </ContainerFooter>
    </Container>
  );
};

export default CadAvaliacao;
