import uuid from 'react-native-uuid';
import iArea from 'types/interfaces/iArea';
import moment from 'moment';
import WithModal from 'component/modal';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Input, LabelForm } from 'styles/boody.containers';

interface iProps {
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const AreaModal: any = WithModal(({ setFormData, checkRelease }: iProps) => {
  const timestamp: number = moment.now();

  const [area, setArea] = useState<iArea>({
    objID: uuid.v4().toString(),
    idFazenda: '',
    nome: '',
    hectares: 0,
    created: new Date(timestamp),
    updated: new Date(timestamp),
  });

  useEffect(() => {
    checkedForm();
    setFormData(area);
  }, [area]);

  /**
   * Este método vai verificar sé todos os campos foram preenchidos.
   * @returns valor referente a validação dos campos.
   */
  const checkedForm = (): void => {
    /// Essa condição será utilizada para carregar os dados referente a adversidade, sendo eles os valores que não foram preenchidos.
    /// Como: tipo, descricao e nivel/ quando esses valores estiverem vazio o retorno será true, indicando que um desses campos não foi preenchido.
    if (!area.nome || !area.hectares || area.hectares === 0) {
      checkRelease(false);
    } else {
      checkRelease(true);
    }
  };

  /**
   * Este método será utilizado para carregar os dados de campo numérico com as seguintes condições:
   * duas casas decimais, limitação do campo, aceitação de números negativos e apenas um ponto decimal.
   * @param text refere-se ao campo digitado.
   */
  const handleNumberChange = (text: string): void => {
    // Permite apenas números, pontos e o sinal de menos (-) no início.
    let value = text.replace(/[^0-9.-]/g, '');

    // Garante que o sinal de menos (-) apareça apenas no início.
    if (value.includes('-')) {
      value = value.replace(/-/g, ''); // Remove todos os sinais de menos.
      value = `-${value}`; // Reinsere o sinal de menos no início.
    }

    // Garante que só exista um ponto no valor.
    const pointIndex = value.indexOf('.');
    if (pointIndex !== -1) {
      value = value.substring(0, pointIndex + 1) + value.substring(pointIndex + 1).replace(/\./g, '');
    }

    // Limita o campo a duas casas decimais.
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 2) {
        value = `${parts[0]}.${parts[1].slice(0, 2)}`;
      }
    }

    // Valida o limite do campo, considerando números negativos.
    if (parseFloat(value) > 9999 || parseFloat(value) < -9999) {
      return;
    }

    if (parseFloat(value) >= 9999 && value.includes('.')) {
      return;
    }

    setArea((prevState: any) => ({ ...prevState, hectares: value }));
  };

  return (
    <View>
      <View>
        <LabelForm>Área : </LabelForm>
        <Input
          value={area.nome}
          onChangeText={(txt: string) => setArea((prev: iArea) => ({ ...prev, nome: txt }))}
        />
      </View>

      <View>
        <LabelForm>Hectares : </LabelForm>
        <Input
          value={area.hectares.toString()}
          keyboardType="number-pad"
          onChangeText={(txt: string) => handleNumberChange(txt)}
        />
      </View>
    </View>
  );
});

export default AreaModal;
