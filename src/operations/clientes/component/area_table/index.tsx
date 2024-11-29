import { ScrollView } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LabelForm } from 'styles/boody.containers';

interface iProps {
  area: string;
  hectares: string;
  onRemove: () => void;
}

export function TableArea({ area, hectares, onRemove }: iProps) {
  return (
    <View>
      <ScrollView>
        <View style={styles.row}>
          <LabelForm style={[styles.cell, styles.titleCell, styles.cellSeparator, styles.text]}>
            {area}
          </LabelForm>
          <LabelForm style={[styles.cell, styles.cellSeparator, styles.text]}>{hectares}</LabelForm>

          <TouchableOpacity
            onPress={onRemove}
            style={[styles.cell, styles.cellSeparator, { alignItems: 'center' }]}>
            <Image source={require('assets/img/Icons/remover.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  containerList: {
    padding: 6,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row' },
  cell: {
    padding: 5,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgb(180, 180, 180)',
    flex: 1,
    fontFamily: 'roboto',
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#1b437e',
    minWidth: 100,
    padding: 10,
  },
  titleCell: {
    backgroundColor: '#f6f8fa',
    alignItems: 'flex-start',
  },
  cellSeparator: {
    minWidth: 80,
    borderRightWidth: 1,
    borderColor: 'rgb(180, 180, 180)',
  },
  text: {
    fontSize: 16,
    fontFamily: 'Poppins600',
  },
});
