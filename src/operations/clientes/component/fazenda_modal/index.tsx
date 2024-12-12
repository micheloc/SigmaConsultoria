import iFazenda from 'types/interfaces/iFazenda';
import uuid from 'react-native-uuid';
import moment from 'moment';
import WithModal from 'component/modal';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { LabelForm } from 'styles/boody.containers';
import Input from 'component/Input';

interface iProps {
  fz: iFazenda;
  isEdited: boolean;
  checkRelease: (isValid: boolean) => void;
  setFormData: (state: any) => void;
}

const FazendaModal: any = WithModal(({ setFormData, checkRelease, fz, isEdited }: iProps) => {
  const timestamp: number = moment.now();

  const [fazenda, setFazenda] = useState<iFazenda>({
    objID: uuid.v4().toString(),
    idCliente: '',
    nome: '',
    created: new Date(timestamp),
    updated: new Date(timestamp),
  });

  useEffect(() => {
    if (fz && isEdited) {
      setFazenda((prev) => ({
        ...prev,
        objID: fz.objID,
        idCliente: fz.idCliente,
        nome: fz.nome,
        created: fz.created,
        updated: fz.updated,
      }));
    }

    return () => {
      setFazenda((prev) => ({
        ...prev,
        objID: uuid.v4().toString(),
        idCliente: '',
        nome: '',
        created: new Date(timestamp),
        updated: new Date(timestamp),
      }));
    };
  }, []);

  useEffect(() => {
    checkedForm();
    setFormData(fazenda);
  }, [fazenda]);

  /**
   * Este método vai verificar sé todos os campos foram preenchidos.
   * @returns valor referente a validação dos campos.
   */
  const checkedForm = (): void => {
    /// Essa condição será utilizada para carregar os dados referente a adversidade, sendo eles os valores que não foram preenchidos.
    /// Como: tipo, descricao e nivel/ quando esses valores estiverem vazio o retorno será true, indicando que um desses campos não foi preenchido.
    if (!fazenda.nome || fazenda.nome.length < 4) {
      checkRelease(false);
    } else {
      checkRelease(true);
    }
  };

  return (
    <View>
      <View>
        <LabelForm>Fazenda : </LabelForm>
        <Input
          placeholder="Informe o nome da fazenda...."
          value={fazenda.nome}
          onChangeText={(txt: string) => setFazenda((prev: any) => ({ ...prev, nome: txt }))}
        />
      </View>
    </View>
  );
});

export default FazendaModal;
