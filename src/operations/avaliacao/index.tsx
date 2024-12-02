import DateTimePicker from '@react-native-community/datetimepicker';
import Input from 'component/Input';
import moment from 'moment';
import uuid from 'react-native-uuid';

import { Container, Divider, LabelForm } from 'styles/boody.containers';
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
import { ScrollView, Text, View, Platform } from 'react-native';
import { useState } from 'react';
import iAvaliacao from 'types/interfaces/iAvaliacao';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';
import iAdversidades from 'types/interfaces/iAdversidades';

import * as RNLocalize from 'react-native-localize';

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
      </ScrollView>
    </Container>
  );
};

export default CadAvaliacao;
