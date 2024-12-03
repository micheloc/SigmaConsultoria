import CadAdversidades from './component/adversidades_modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from 'component/Input';
import moment from 'moment';
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';

import { ButtonConf, Container, Divider, Label, LabelForm } from 'styles/boody.containers';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/routers';
import {
  ContainerDate,
  ContainerTitleArea,
  ContainerTitles,
  ContainerTouchDate,
  TextTitleArea,
  TextTitles,
} from './style';
import { ScrollView, Text, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import iAvaliacao from 'types/interfaces/iAvaliacao';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';
import iAdversidades from 'types/interfaces/iAdversidades';

import * as RNLocalize from 'react-native-localize';
import { Dropdown } from 'react-native-element-dropdown';
import iCultura from 'types/interfaces/iCultura';
import { _getAllCultura } from 'services/cultura_service';
import iVariedade from 'types/interfaces/iVariedade';
import iFase from 'types/interfaces/iFase';
import { _findAllFaseByCultura } from 'services/fase_service';
import { _findAllVariedadesByCultura, _getAllVariedades } from 'services/variedade_service';
import { ContainerFooter } from 'component/modal/style';
import CadEspecificos from './component/especificos_modal';

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
  // Obter a localidade do dispositivo (pt-BR ou outro)
  const locale = RNLocalize.getLocales()[0].languageTag;

  const timestamp = moment.now();

  const [showDate, setShowDate] = useState<boolean>(false);
  const [showAdversidades, setShowAdversidades] = useState<boolean>(false);
  const [showEspecificos, setShowEspecificos] = useState<boolean>(false);

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
    image: [],
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

  const title_especificacoes = avaliacao.especificacoes.map((item) => item.especificacao);
  const data_especificacoes = avaliacao.especificacoes.map((item) => [item.descricao]);

  const title_adversidades = avaliacao.adversidades.map((item) => item.descricao);
  const data_adversidades = avaliacao.adversidades.map((item) => [
    item.descricao,
    item.nivel,
    item.image ? '✅' : '❌',
  ]);

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de adversidades.
   * @param props refere-se aos valores infomados na modal.
   */
  const onSubmitAdversidades = (props: iAdversidades) => {
    const problems: iAdversidades[] = [...avaliacao.adversidades];
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

    setAvaliacao((prevState: any) => ({ ...prevState, adversidades: problems }));
    setShowAdversidades(false);
  };

  /**
   * Este método será utilizado para capturar os valores informados na modal de cadastro de especificações.
   * @param props refere-se aos valores informados na modal.
   */
  const onSubmitEspecificacoes = (props: iEspecificacoes) => {
    const especificacoes: iEspecificacoes[] = [...avaliacao.especificacoes];
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

    setAvaliacao((prevState: any) => ({ ...prevState, especificacoes: especificacoes }));
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
      textAlign: 'center',
      borderWidth: 1,
      borderColor: 'rgb(180, 180, 180)',
      flex: 1,
      fontFamily: 'roboto',
    },
  });

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
          <LabelForm>Avaliadroes : </LabelForm>
          <Input placeholder="Informe o nome dos avaliadores..." />
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
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]}>
                        Especificação
                      </Text>
                      <Text style={[styles.cell, styles.headerCell, styles.cellSeparator]} />
                    </>
                  </View>
                  <ScrollView>
                    {data_especificacoes.map((rowData, rowIndex) => (
                      <TouchableOpacity key={rowIndex}>
                        <View key={rowIndex} style={styles.row}>
                          <Text style={[styles.cell, styles.titleCell, styles.cellSeparator]}>
                            {title_especificacoes[rowIndex]}
                          </Text>
                          {rowData.map((cellData, cellIndex) => (
                            <Text key={cellIndex} style={[styles.cell, styles.cellSeparator]}>
                              {cellData}
                            </Text>
                          ))}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
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
                  <ScrollView>
                    {data_adversidades.map((rowData, rowIndex) => (
                      <TouchableOpacity onPress={() => console.log('olá')} key={rowIndex}>
                        <View key={rowIndex} style={styles.row}>
                          <Text style={[styles.cell, styles.titleCell, styles.cellSeparator]}>
                            {title_adversidades[rowIndex].toUpperCase()}
                          </Text>
                          {rowData.map((cellData, cellIndex) => (
                            <Text key={cellIndex} style={[styles.cell, styles.cellSeparator]}>
                              {cellData}
                            </Text>
                          ))}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      <CadEspecificos
        visible={showEspecificos}
        onClose={() => setShowEspecificos(false)}
        onSubmitForm={onSubmitEspecificacoes}
      />

      <CadAdversidades
        visible={showAdversidades}
        onClose={() => setShowAdversidades(false)}
        onSubmitForm={onSubmitAdversidades}
      />

      <ContainerFooter style={{ padding: 5 }}>
        <ButtonConf onPress={() => console.log(avaliacao)}>
          <Label>Confirmar cadastro</Label>
        </ButtonConf>
      </ContainerFooter>
    </Container>
  );
};

export default CadAvaliacao;
