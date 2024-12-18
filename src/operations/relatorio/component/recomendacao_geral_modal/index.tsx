import Input from 'component/Input';
import WithModal from 'component/modal';

import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { LabelForm } from 'styles/boody.containers';

interface iProps {
  reco: string;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const RecomendacaoGeralModal: any = WithModal(({ setFormData, checkRelease, reco }: iProps) => {
  const [recomendacao, setRecomendacao] = useState<string>('');

  useEffect(() => {
    checkedForm();
    setFormData(recomendacao);
  }, [recomendacao]);

  useEffect(() => {
    if (reco) {
      setRecomendacao(reco);
    }

    return () => {
      setRecomendacao('');
    };
  }, []);

  const checkedForm = (): void => {
    if (recomendacao) {
      checkRelease(true);
    } else {
      checkRelease(false);
    }
  };

  return (
    <View style={styles.textAreaContainer}>
      <LabelForm>Descrição da recomendação : </LabelForm>
      <Input
        style={styles.textArea}
        value={recomendacao}
        onChangeText={(txt: string) => setRecomendacao(txt)}
        placeholder="Informe os dados da recomendação... "
        multiline={true}
        numberOfLines={4}
      />
    </View>
  );
});

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

export default RecomendacaoGeralModal;
