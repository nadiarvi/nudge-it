import { ThemedText, ThemedView } from '@/components/ui';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export default function ModalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="H1">This is a modal</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="Body1">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: RFValue(1),
    alignItems: 'center',
    justifyContent: 'center',
    padding: RFValue(20),
  },
  link: {
    marginTop: RFValue(15),
    paddingVertical: RFValue(15),
  },
});
