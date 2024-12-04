import styled from 'styled-components/native';
export const ContainerPhoto = styled.TouchableOpacity`
  padding: 15px 15px 25px 15px;
  border: 1px dashed rgba(184, 184, 184, 1);
  align-items: center;
  justify-content: center;
`;

export const ContainerModalGalery = styled.View`
  flex: 1;
  padding-left: 1%;
  padding-right: 3%;
  margin-left: 6%;
  justify-content: center;
`;

export const ButtonCancel = styled.TouchableOpacity`
  background-color: #97020e;
  padding: 10px;
  margin-left: 1%;
  width: 100%;
  border-radius: 5px;
  align-items: center;
`;

export const Imagem = styled.Image`
  width: 100%;
  height: 100%;
  max-width: 300;
  max-height: 300;
  align-self: center;
`;

export const ContainerImagem = styled.TouchableOpacity`
  max-height: 300px;
  border: 1px dashed rgba(184, 184, 184, 1);
  align-items: center;
  justify-content: center;
`;
