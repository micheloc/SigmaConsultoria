import iFazenda from 'types/interfaces/iFazenda';
import uuid from 'react-native-uuid';
import moment from 'moment';
import WithModal from 'component/modal';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Input, LabelForm } from 'styles/boody.containers';

interface iProps {
  setFormData: (state: any) => void;
  onSubmitForm: (data: any) => void;
}

const FazendaModal: any = WithModal(({ setFormData }: iProps) => {
  const timestamp: number = moment.now();

  const [fazenda, setFazenda] = useState<iFazenda>({
    objID: uuid.v4().toString(),
    idCliente: '',
    nome: '',
    created: new Date(timestamp),
    updated: new Date(timestamp),
  });

  useEffect(() => {
    setFormData(fazenda);
  }, [fazenda]);

  return (
    <View>
      <View>
        <LabelForm>Fazenda : </LabelForm>
        <Input
          value={fazenda.nome}
          onChangeText={(txt: string) => setFazenda((prev: any) => ({ ...prev, nome: txt.toUpperCase() }))}
        />
      </View>
    </View>
  );
});

export default FazendaModal;
