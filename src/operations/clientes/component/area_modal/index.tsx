import uuid from 'react-native-uuid';
import iArea from 'types/interfaces/iArea';
import moment from 'moment';
import WithModal from 'component/modal';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Input, LabelForm } from 'styles/boody.containers';

interface iProps {
  setFormData: (state: any) => void;
  onSubmitForm: (data: any) => void;
}

const AreaModal: any = WithModal(({ setFormData }: iProps) => {
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
    setFormData(area);
  }, [area]);

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
          onChangeText={(txt: string) => setArea((prev: any) => ({ ...prev, hectares: txt }))}
        />
      </View>
    </View>
  );
});

export default AreaModal;
