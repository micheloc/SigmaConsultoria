import iAvaliacao, { iAvaliacaoRealm } from 'types/interfaces/iAvaliacao';
import iAdversidades from 'types/interfaces/iAdversidades';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';
import NetInfo from '@react-native-community/netinfo';

import { ButtonConf, Container, Label } from 'styles/boody.containers';
import { ContainerFooter } from 'component/modal/style';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, View, StyleSheet } from 'react-native';

import {
  _createAdversidades,
  _getAllAdversidades,
  _removeAllAdversidades,
} from 'services/adversidades_service';
import { _createAvaliacao, _getAllAvaliacoes, _removeAllAvaliacao } from 'services/avaliacao_service';
import {
  _createEspecificacoes,
  _getAllEspecificacoes,
  _removeAllEspecificacoes,
} from 'services/especificacoes_service';

interface iProps {
  objID: string;
  idArea: string;
  idCultura: string;
  idFase: string;
  idVariedade: string;
  avaliadores: string;
  data: Date;
  especificacoes: iEspecificacoes[];
  adversidades: iAdversidades[];
  image: any[];
  recomendacao: any[];
  pdf: any[];
}

const CadRecomendacao = ({ route }: any) => {
  const avaliacao: iProps = route.params;

  const nav: any = useNavigation();

  const [confReg, setConfReg] = useState<boolean>(false);

  const [registro, setRegistro] = useState<iAvaliacao>({
    objID: avaliacao.objID,
    idArea: avaliacao.idArea,
    idCultura: avaliacao.idCultura,
    idFase: avaliacao.idFase,
    idVariedade: avaliacao.idVariedade,
    avaliadores: avaliacao.avaliadores,
    data: avaliacao.data,
    especificacoes: [...avaliacao.especificacoes],
    adversidades: [...avaliacao.adversidades],
    image: [],
    recomendacao: '',
    pdf: [],
  });

  const handlePress = async () => {
    // await _removeAllAvaliacao();
    // await _removeAllAdversidades();
    // await _removeAllEspecificacoes();

    const realm_avaliacao: iAvaliacaoRealm = {
      objID: registro.objID,
      idArea: registro.idArea,
      idCultura: registro.idCultura,
      idFase: registro.idFase,
      idVariedade: registro.idVariedade,
      avaliadores: registro.avaliadores,
      data: registro.data,
      image: registro.image,
      pdf: registro.pdf,
      recomendacao: registro.recomendacao,
    };

    const resp_avaliacao = await _createAvaliacao(realm_avaliacao);
    console.log('avaliação', resp_avaliacao);

    if (resp_avaliacao) {
      setTimeout(async () => {
        const resp_adversidade = await _createAdversidades(registro.adversidades);
        console.log('adversidade', resp_adversidade);
        if (resp_adversidade) {
          setTimeout(async () => {
            const resp_especificacoes = await _createEspecificacoes(registro.especificacoes);
            console.log('especificacoes', resp_especificacoes);
            if (resp_especificacoes) {
              setConfReg(true);
            }
          }, 500);
        }
      }, 500);
    }

    try {
      setTimeout(async () => {
        nav.navigate('navAvaliacao', {
          ...registro,
        });
      }, 1500);
    } catch (error) {
      console.log('errro ao redirecionar', error);
    }
  };

  return (
    <Container>
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          value={registro.recomendacao}
          onChangeText={(txt) => setRegistro((prevState) => ({ ...prevState, recomendacao: txt }))}
          placeholder="Inserir recomendação..."
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <ContainerFooter>
        <ButtonConf onPress={() => handlePress()}>
          <Label>Registrar avaliação</Label>
        </ButtonConf>
      </ContainerFooter>
    </Container>
  );
};

const styles = StyleSheet.create({
  textAreaContainer: {
    flex: 1, // Faz o campo de texto ocupar o espaço disponível
    marginBottom: 80, // Garante espaço suficiente para o botão
  },
  textArea: {
    flex: 1,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    margin: 8,
  },
});

export default CadRecomendacao;
