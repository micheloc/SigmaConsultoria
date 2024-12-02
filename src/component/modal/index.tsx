import React, { useState, useEffect } from 'react';
import { Modal as IsModal, View, Text, TouchableOpacity } from 'react-native';
import { BoxView, Container } from 'styles/boody.containers';
import dimensions from 'util/adjust_size';

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

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                marginLeft: 10,
                marginRight: 10,
              }}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: '#0c6325',
                  padding: 10,
                  width: 175,
                  borderRadius: 5,
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Adicionar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                style={{
                  backgroundColor: '#97020e',
                  padding: 10,
                  width: 175,
                  borderRadius: 5,
                  alignItems: 'center',
                }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </BoxView>
        </Container>
      </IsModal>
    );
  };

  return ModalHOC;
};

export default WithModal;
