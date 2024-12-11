import uuid from 'react-native-uuid';
import Input from 'component/Input';
import iFase from 'types/interfaces/iFase';
import WithModal from 'component/modal';

import { LabelForm } from 'styles/boody.containers';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { InputGroup } from 'native-base';

interface iProps {
  fs: iFase;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const CadFase: any = WithModal(({ setFormData, checkRelease, fs }: iProps) => {
  const [fase, setFase] = useState<iFase>({
    objID: uuid.v4().toString(),
    idCultura: '',
    nome: '',
    dapMedio: 0,
  });

  useEffect(() => {
    checkedForm();
    setFormData(fase);
  }, [fase]);

  useEffect(() => {
    if (fs) {
      console.log(fs);

      setFase((prev) => ({
        ...prev,
        objID: fs.objID,
        idCultura: fs.idCultura,
        nome: fs.nome,
        dapMedio: fs.dapMedio,
      }));
    }

    return () => {
      setFase((prev) => ({
        ...prev,
        objID: uuid.v4().toString(),
        idCultura: '',
        nome: '',
        dapMedio: 0,
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
    if (!fase.nome) {
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
    console.log(text);

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

    setFase((prevState: any) => ({ ...prevState, dapMedio: value }));
  };

  return (
    <View>
      <View>
        <LabelForm>Fase : </LabelForm>
        <Input
          maxLength={30}
          placeholder="Informe a fase..."
          value={fase.nome}
          onChangeText={(txt: string) => setFase((prev) => ({ ...prev, nome: txt }))}
        />
      </View>
      <View>
        <LabelForm>DapMedio : </LabelForm>
        <Input
          keyboardType="numeric"
          placeholder="Informe o dap médio"
          value={fase.dapMedio.toString()}
          onChangeText={(txt: string) => handleNumberChange(txt)}
        />
      </View>
    </View>
  );
});

export default CadFase;
