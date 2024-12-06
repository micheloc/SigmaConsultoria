import styled from 'styled-components/native';

export const ContainerLstArea = styled.View`
  flex: 1;
  alignt-items: center;
  background-color: white;
  border-radius: 5px;
  flex-direction: row;
  margin-top: 8px;
  padding-left: 15px;
  justify-content: space-between;
  heigth: 100%;
  width: 100%;
`;

export const ContainerTitleArea = styled.View`
  background-color: #1b437e;
  border-color: #ccc;
  border-radius: 5px;
  margin-left: 1.2%;
  margin-bottom: 5px;
  width: 97.5%;
`;

export const TextTitleArea = styled.Text`
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-wight: bold;
  color: white;
`;

export const Divider = styled.View`
  background-color: #979797;
  border-radius: 4px;
  height: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 1.2%;
  width: 97.5%;
`;

export const List = styled.FlatList`
  max-height: 70%;
`;
