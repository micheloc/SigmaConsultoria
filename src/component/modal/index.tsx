import dimensions from 'util/adjust_size';
import React, { useState, useEffect } from 'react';

import { BoxView } from 'styles/boody.containers';
import { Modal as IsModal, View, Text, TouchableOpacity } from 'react-native';
import { ButtonCancel, ButtonConfirm, Container, ContainerFooter } from './style';

interface ModalProps {
  visible: boolean;
  height: string | undefined;
  onClose: () => void;
  onSubmitForm: (props: any) => void;
}

const WithModal = (WrappedComponent: React.ComponentType<any>) => {
  const ModalHOC = ({ visible, onClose, height, ...props }: ModalProps) => {
    const [formData, setFormData] = useState<any>({});
    const [sizeHeight, setSizeHeight] = useState<any>('32%');

    useEffect(() => {
      let altura = dimensions.isTablet ? '26%' : '32%';
      if (height) {
        altura = height;
      }

      setSizeHeight(altura);
    }, []);

    const handleSubmit = () => {
      props.onSubmitForm(formData);
    };

    return (
      <IsModal visible={visible} animationType="slide" transparent>
        <Container
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <BoxView
            style={{
              borderColor: 'black', // Define a cor da borda
              borderWidth: 2, // Define a largura da borda
              borderRadius: 5, // (Opcional) Torna os cantos arredondados
            }}>
            <View>
              <WrappedComponent {...props} setFormData={setFormData} />
            </View>

            <ContainerFooter>
              <ButtonConfirm onPress={handleSubmit}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Adicionar</Text>
              </ButtonConfirm>

              <ButtonCancel onPress={onClose}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Fechar</Text>
              </ButtonCancel>
            </ContainerFooter>
          </BoxView>
        </Container>
      </IsModal>
    );
  };

  return ModalHOC;
};

export default WithModal;
