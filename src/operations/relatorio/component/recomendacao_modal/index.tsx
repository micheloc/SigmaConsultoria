import uuid from 'react-native-uuid';
import WithModal from 'component/modal';

import { StyleSheet, View } from 'react-native';
import { iRelatorioExport } from 'types/interfaces/iRelatorio';
import { useEffect, useState } from 'react';
import { LabelForm } from 'styles/boody.containers';
import Input from 'component/Input';

interface iProps {
  rel: iRelatorioExport;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const RecomendacaoModal: any = WithModal(({ setFormData, checkRelease, rel }: iProps) => {
  const [relatorio, setRelatorio] = useState<iRelatorioExport>({
    objID: uuid.v4().toString(),
    idCultura: '',
    idFase: '',
    area: '',
    fase: '',
    cultura: '',
    recomendacao: '',
  });

  useEffect(() => {
    checkedForm();
    setFormData(relatorio);
  }, [relatorio]);

  useEffect(() => {
    if (rel) {
      setRelatorio((prev) => ({
        ...prev,

        objID: rel.objID,
        idCultura: rel.idCultura,
        idFase: rel.idFase,
        area: rel.area,
        fase: rel.fase,
        cultura: rel.cultura,
        recomendacao: rel.recomendacao,
      }));
    }

    return () => {
      setRelatorio((prev) => ({
        ...prev,
        objID: uuid.v4().toString(),
        idCultura: '',
        idFase: '',
        area: '',
        fase: '',
        cultura: '',
        recomendacao: '',
      }));
    };
  }, []);

  const checkedForm = (): void => {
    if (relatorio.recomendacao) {
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
        value={relatorio.recomendacao}
        onChangeText={(txt: string) => setRelatorio((prevState) => ({ ...prevState, recomendacao: txt }))}
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

export default RecomendacaoModal;
