import styled from 'styled-components/native';

/**
 *
 */
export const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  position: relative; /* Isso garante que o ViewFormLogin será posicionado em relação ao Container */
`;

/**
 *
 */
export const ContainerIconLogin = styled.View`
  flex: 1;
  width: 100%;
  height: 49%;
  position: absolute; /* Faz o ViewFormLogin se sobrepor ao Container */
  justify-content: center; /* Alinha os itens no centro verticalmente */
  align-items: center; /* Alinha os itens no centro horizontalmente */
`;

/**
 *
 */
export const ViewFormLogin = styled.View`
  position: absolute; /* Faz o ViewFormLogin se sobrepor ao Container */
  justify-content: center; /* Alinha os itens no centro verticalmente */
  align-items: center; /* Alinha os itens no centro horizontalmente */
  bottom: 0; /* Faz o ViewFormLogin ocupar toda a área do Container */
  top: -11.5%;
  left: 0;
  right: 0;
  z-index: 10; /* Garante que o ViewFormLogin fique acima de outros componentes */
`;

/**
 *
 */
export const BoxFormLogin = styled.View`
  position: absolute; /* Faz o ViewFormLogin se sobrepor ao Container */
  background-color: rgba(44, 46, 17, 0.5);
  width: 85%;
  height: 18%;
  border-radius: 8px;
  z-index: 20; /* Garante que o ViewFormLogin fique acima de outros componentes */
`;

/**
 *
 */
export const BackgroundImg = styled.Image`
  width: 100%;
  height: 100%;
`;

export const Input = styled.TextInput`
  background-color: whitesmoke;
  border-radius: 5px;
  font-size: 16px;
  margin: 5px;
`;

export const ButtonConf = styled.TouchableOpacity`
  background-color: #3aa637;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
  margin-left: 5px;
  width: 97.5%;
  align-items: center;
  color: white;
`;

export const ButtonUpdate = styled.TouchableOpacity`
  background-color: #3aa637;
  padding: 10px;
  border-radius: 5px;
  margin: 5px;
  width: 100%;
  align-items: center;
`;

export const ButtonEnd = styled.TouchableOpacity`
  background-color: #3aa637;
  padding: 10px;
  border-radius: 5px;
  margin: 5px;
  width: 100%;
  align-items: center;
`;
