import uuid from 'react-native-uuid';
import Input from 'component/Input';
import iEspecificacoes from 'types/interfaces/iEspecificacoes';
import WithModal from 'component/modal';

import { Box, Select, CheckIcon } from 'native-base';
import { LabelForm } from 'styles/boody.containers';
import { View } from 'react-native';
import { useEffect, useState } from 'react';

interface iProps {
  esp: iEspecificacoes;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const CadEspecificos: any = WithModal(({ setFormData, checkRelease, esp }: iProps) => {
  const [especificacao, setEspecificacao] = useState<iEspecificacoes>({
    objID: uuid.v4().toString(),
    idAvaliacao: '',
    especificacao: '',
    descricao: '',
  });

  useEffect(() => {
    checkedForm();
    setFormData(especificacao);
  }, [especificacao]);

  useEffect(() => {
    if (esp) {
      setEspecificacao((prev) => ({
        ...prev,
        objID: esp.objID,
        idAvaliacao: esp.idAvaliacao,
        descricao: esp.descricao,
        especificacao: esp.especificacao,
      }));
    }

    return () => {
      setEspecificacao((prev) => ({
        ...prev,
        objID: uuid.v4().toString(),
        idAvaliacao: '',
        especificacao: '',
        descricao: '',
      }));
    };
  }, []);

  /**
   * Este método vai verificar sé todos os campos foram preenchidos.
   * @returns valor referente a validação dos campos.
   */
  const checkedForm = (): void => {
    /// Essa condição será utilizada para carregar os dados referente a adversidade, sendo eles os valores que não foram preenchidos.
    /// Como: tipo, descricao e nivel/ quando esses valores estiverem vazio o retorno será true, indicando que um desses campos não foi preenchido.
    if (especificacao.especificacao === '' || especificacao.descricao === '') {
      checkRelease(false);
    } else {
      checkRelease(true);
    }
  };

  return (
    <View>
      <Box width="100%" marginBottom="1">
        <LabelForm>Tipo : </LabelForm>
        <Select
          fontSize={16}
          backgroundColor="white"
          selectedValue={especificacao.especificacao}
          minWidth="200"
          accessibilityLabel="Selecione os Especificos"
          placeholder="Selecione os Especificos"
          _selectedItem={{
            bg: 'teal.600',
            endIcon: <CheckIcon size="5" color="white" marginTop={2} />,
          }}
          mt={1}
          onValueChange={(itemValue) => {
            setEspecificacao((prevDate: any) => ({
              ...prevDate,
              especificacao: itemValue,
            }));
          }}>
          <Select.Item label="Nós" value="Nós" />
          <Select.Item label="Raizes" value="Raizes" />
          <Select.Item label="N+FS (Nematoides + Fungos de Solo)" value="N+FS" />
          <Select.Item label="Stand" value="Stand" />
          <Select.Item label="Aspecto" value="Aspecto" />
          <Select.Item label="Acamamento" value="Acamamento" />
          <Select.Item label="Outros" value="Outros" />
        </Select>
      </Box>

      <View>
        <LabelForm>Especificação : </LabelForm>
        <Input
          maxLength={30}
          placeholder="insira os dados"
          value={especificacao.descricao}
          onChangeText={(txt: string) =>
            setEspecificacao((prevState) => ({ ...prevState, descricao: txt }))
          }
        />
      </View>
    </View>
  );
});

export default CadEspecificos;
