import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Dropdown as Drop } from 'react-native-element-dropdown';

const Dropdown = ({ data, onChange, ...props }: any) => {
  const screenHeight = Dimensions.get('window').height;
  const dropSize = screenHeight * 0.3; // 30% da altura da tela

  const [lst, setLst] = useState<any[]>([]);

  // Função para verificar se todos os valores do objeto são null
  const todosValoresNulos = (obj: any) => {
    return Object.values(obj).every((v) => v === '' || v === null || v === undefined);
  };

  useEffect(() => {
    if (data.length > 0) {
      const filter_dt = data.filter((item: any) => !todosValoresNulos(item));
      setLst(filter_dt);
    } else {
      setLst([]);
    }
  }, [data]);

  return (
    <Drop
      {...props}
      data={lst}
      onChange={onChange}
      maxHeight={dropSize}
      disabled={true} // Desabilita o campo
      style={[styles.dropdownSelect, props.style]} // Permite a personalização do estilo
    />
  );
};

const styles = StyleSheet.create({
  dropdownSelect: {
    height: 50,
    width: '97%',
    backgroundColor: 'whitesmoke',
    borderRadius: 5,
    padding: '1%',
    textAlign: 'center',
    alignItems: 'center',
    elevation: 4,
    marginLeft: 5,
  },
});

export default Dropdown;
