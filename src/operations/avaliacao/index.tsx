import CadAdversidades from './component/adversidades_modal';
import CadEspecificos from './component/especificos_modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from 'component/Input';
import moment from 'moment';
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
import { Dropdown } from 'react-native-element-dropdown';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ScrollView, Text, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { ParamListBase } from '@react-navigation/routers';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';

import { _findAllVariedadesByCultura, _getAllVariedades } from 'services/variedade_service';
import { _findAllFaseByCultura } from 'services/fase_service';
import { _getAllCultura } from 'services/cultura_service';

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

  const [isEditedAdversidade, setIsEditedAdversidade] = useState<boolean>(false);
  const [isEditedEspecificacoes, setIsEditedEspecificacoes] = useState<boolean>(false);

  const [adversidade, setAdversidade] = useState<iAdversidades | null>();
  const [especificacao, setEspecificacao] = useState<iEspecificacoes | null>();

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

  useEffect(() => {
    const loadingCultura = async () => {
      const resp: any = await _getAllCultura();
      setCultura(resp);
    };

    loadingCultura();
  }, []);

  useEffect(() => {
    /**
     * Este método será utilizado para carregar a fase.
     */
    const loading_fase = async () => {
      const resp: any = await _findAllFaseByCultura(avaliacao.idCultura);
      if (resp) {
        setFase(resp);
      }
    };

    const loading_avaliacao = async () => {
      const resp: any = await _findAllVariedadesByCultura(avaliacao.idCultura);
      if (resp) {
        setVariedade(resp);
      }
    };

    loading_fase();
    loading_avaliacao();
  }, [avaliacao.idCultura]);

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

  const styles = StyleSheet.create({
    dropdownSelect: {
      height: 40,
      width: '97%',
      backgroundColor: 'whitesmoke',
      borderRadius: 5,
      padding: 15,
      textAlign: 'center',
      alignItems: 'center',
      elevation: 4,
      marginLeft: 5,
    },
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
    setAdversidade(row);
    setIsEditedAdversidade(true);
    setTimeout(() => {
      setShowAdversidades(true);
    }, 500);
  };

  const edited_especificacao = (row: iEspecificacoes) => {
    setEspecificacao(row);
    setIsEditedEspecificacoes(true);
    setTimeout(() => {
      setShowEspecificos(true);
    }, 500);
  };

  return (
    <Container style={{ backgroundColor: '#ccc' }}>
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
            style={styles.dropdownSelect}
            labelField="nome"
            valueField="objID"
            placeholder="Selecione a cultura..."
            searchPlaceholder="Pesquisar por cultura"
            onChange={(item: any) => {
              setAvaliacao((prevState) => ({ ...prevState, idCultura: item.objID }));
            }}
          />
        </View>

        <View>
          <LabelForm>Fase : </LabelForm>
          <Dropdown
            search
            data={fase}
            style={styles.dropdownSelect}
            labelField="nome"
            valueField="objID"
            placeholder="Selecione a fase..."
            searchPlaceholder="Pesquisar por fase"
            onChange={(item: any) => {
              setAvaliacao((prevState) => ({ ...prevState, idFase: item.objID }));
            }}
          />
        </View>

        <View>
          <LabelForm>Variedade : </LabelForm>
          <Dropdown
            search
            data={variedade}
            style={styles.dropdownSelect}
            labelField="nome"
            valueField="objID"
            placeholder="Selecione a variedade..."
            searchPlaceholder="Pesquisar por variedade"
            onChange={(item: any) => {
              setAvaliacao((prevState) => ({ ...prevState, idVariedade: item.objID }));
            }}
          />
        </View>

        {avaliacao.idCultura && (
          <>
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
          </>
        )}

        {avaliacao.idCultura && (
          <>
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
        adv={adversidade}
        onClose={() => {
          setAdversidade(null);
          setIsEditedAdversidade(false);
          setShowAdversidades(false);
        }}
        onSubmitForm={onSubmitAdversidades}
      />

      <CadEspecificos
        visible={showEspecificos}
        esp={especificacao}
        onClose={() => {
          setEspecificacao(null);
          setShowEspecificos(false);
          setIsEditedEspecificacoes(false);
        }}
        onSubmitForm={onSubmitEspecificacoes}
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
