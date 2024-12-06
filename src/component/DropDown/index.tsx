import { Dimensions, StyleSheet, KeyboardAvoidingView } from 'react-native';
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
      style={[styles.dropdownSelect, props.style]} // Permite a personalização do estilo
    />
  );
};

const styles = StyleSheet.create({
  dropdownSelect: {
    height: 40,
    width: '97%',
    backgroundColor: 'whitesmoke',
    borderRadius: 5,
    padding: 15,
    textAlign: 'center',
    alignItems: 'center',
    elevation: 4,
    marginLeft: 5,
  },
});

export default Dropdown;
