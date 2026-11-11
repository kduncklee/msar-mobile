import Header from '@components/Header';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccessCodesMenuPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Access Codes" backButton />
      <View style={styles.content}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, styles.actionButton]}
          onPress={() => router.push('/access-codes/search')}
        >
          <Text style={styles.buttonText}>Search all Access Codes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, styles.actionButton]}
          onPress={() => router.push('/access-codes/nearby')}
        >
          <Text style={styles.buttonText}>Show Nearby Access Codes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, styles.actionButton]}
          onPress={() => router.push('/access-codes/add')}
        >
          <Text style={styles.buttonText}>Add Access Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  actionButton: {
    marginVertical: 12,
    height: 56,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
});
