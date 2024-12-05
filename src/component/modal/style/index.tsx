import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

export const ContainerFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
  width: 100%;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  flex: 1;
  background-color: #0c6325;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
  margin-right: 10px;
`;

export const ButtonCancel = styled.TouchableOpacity`
  flex: 1;
  background-color: #97020e;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
`;
