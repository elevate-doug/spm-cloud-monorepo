import { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { SimpleList } from '../../components/data-display'
import { Button } from '../../components/inputs'
import { Typography } from '../../components/typography'
import { LingoColors } from '../../theme'
import { H_PADDING, V_PADDING } from '../../values'
export type BarcodeItem = {
  id: string
  label: string
}
export type BarcodeConflictTemplateProps = {
  barcode: string
  items: BarcodeItem[]
  onCancel: () => void
  onContinue: (barcode: BarcodeItem) => void
}
export const BarcodeConflictTemplate: FC<BarcodeConflictTemplateProps> = ({
  barcode,
  items,
  onCancel,
  onContinue,
}) => {
  const [selectedItem, setSelectedItem] = useState<BarcodeItem | undefined>()
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h6" style={styles.header}>
          Barcode Conflict
        </Typography>
        <Typography variant="h6" style={styles.header}>
          {`The barcode '${barcode}' you just scanned could refer to multiple items in SPM. Please select the item you wished to scan.`}
        </Typography>
        <SimpleList
          data={items}
          selectedItem={selectedItem}
          keyExtractor={(item: BarcodeItem) => item.id}
          labelExtractor={(item: BarcodeItem) => item.label}
          onSelectItem={setSelectedItem}
        />
      </View>
      <View style={styles.buttons}>
        <Button mode="outlined" customStyle={styles.button} onPress={onCancel}>
          Cancel
        </Button>
        <Button
          mode="contained"
          customStyle={styles.button}
          disabled={!selectedItem}
          onPress={() => selectedItem && onContinue(selectedItem)}
        >
          OK
        </Button>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LingoColors.background.paper,
  },
  content: {
    flex: 1,
    paddingHorizontal: H_PADDING,
  },
  header: {
    marginVertical: V_PADDING,
    fontSize: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: H_PADDING,
    marginTop: 10,
    backgroundColor: LingoColors.background.paper,
    shadowColor: LingoColors.common.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  button: {
    height: 42,
    flex: 0.45,
  },
})
export default BarcodeConflictTemplate
