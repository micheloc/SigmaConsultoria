import { Dimensions, StyleSheet } from 'react-native';
import { Dropdown as Drop } from 'react-native-element-dropdown';

const Dropdown = ({ data, onChange, ...props }: any) => {
  const screenHeight = Dimensions.get('window').height;
  const dropSize = screenHeight * 0.3; // 30% da altura da tela

  return (
    <Drop
      {...props}
      data={data}
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
