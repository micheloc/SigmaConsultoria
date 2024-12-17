import uuid from 'react-native-uuid';
import Input from 'component/Input';
import iVariedade from 'types/interfaces/iVariedade';
import WithModal from 'component/modal';

import { LabelForm } from 'styles/boody.containers';
import { View } from 'react-native';
import { useEffect, useState } from 'react';

interface iProps {
  vari: iVariedade;
  isEdited: boolean;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const CadVariedadeCultura: any = WithModal(({ setFormData, checkRelease, vari, isEdited }: iProps) => {
  const [variedade, setVariedade] = useState<iVariedade>({
    objID: uuid.v4().toString(),
    idCultura: '',
    nome: '',
  });

  useEffect(() => {
    checkedForm();
    setFormData(variedade);
  }, [variedade]);

  useEffect(() => {
    if (vari && isEdited) {
      setVariedade((prev) => ({
        ...prev,
        objID: vari.objID,
        idCultura: vari.idCultura,
        nome: vari.nome,
      }));
    }

    return () => {
      setVariedade((prev) => ({
        ...prev,
        objID: '',
        idCultura: '',
        nome: '',
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
    if (!variedade.nome) {
      checkRelease(false);
    } else {
      checkRelease(true);
    }
  };

  return (
    <View>
      <LabelForm>Nome da variedade : </LabelForm>
      <Input
        maxLength={30}
        placeholder="Inoforme o nome da variedade..."
        value={variedade.nome}
        onChangeText={(txt: string) => setVariedade((prev) => ({ ...prev, nome: txt }))}
      />
    </View>
  );
});

export default CadVariedadeCultura;
