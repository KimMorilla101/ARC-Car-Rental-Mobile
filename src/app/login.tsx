import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    router.replace('/home' as never);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()}><Text style={styles.back}>‹  Back</Text></Pressable>
          <View style={styles.logoRow}><View style={styles.mark}><Text style={styles.markText}>A</Text></View><Text style={styles.logo}>ARC <Text style={styles.logoAccent}>RIDE</Text></Text></View>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to manage your bookings and rentals.</Text>
          <View style={styles.form}>
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#8B9AB0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#8B9AB0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.options}><Text style={styles.remember}>□  Remember me</Text><Pressable><Text style={styles.link}>Forgot password?</Text></Pressable></View>

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handleLogin}><Text style={styles.buttonText}>Sign in  →</Text></Pressable>

        <View style={styles.signupRow}><Text style={styles.signupText}>New to ARC Ride? </Text><Pressable onPress={() => router.push('/register' as never)}><Text style={styles.link}>Create account</Text></Pressable></View>
      </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' }, safeArea: { flex: 1 }, scrollContent: { flexGrow: 1, padding: 28, paddingTop: 18, justifyContent: 'center' },
  back: { color: '#347FF5', fontSize: 15, fontWeight: '700', marginBottom: 30 }, logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 46 }, mark: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#347FF5', alignItems: 'center', justifyContent: 'center' }, markText: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' }, logo: { color: '#13233C', fontSize: 18, fontWeight: '800', letterSpacing: 1, marginLeft: 10 }, logoAccent: { color: '#347FF5' }, title: { color: '#10213A', fontSize: 36, fontWeight: '800', letterSpacing: -1, marginBottom: 8 }, subtitle: { color: '#708099', fontSize: 15, lineHeight: 22, marginBottom: 30 }, form: { width: '100%' }, label: { color: '#63758F', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginTop: 17 }, input: { backgroundColor: '#FFFFFF', borderRadius: 13, paddingHorizontal: 16, paddingVertical: 16, color: '#14243B', fontSize: 15, borderWidth: 1, borderColor: '#DCE5F0' }, options: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }, remember: { color: '#6E7D91', fontSize: 13 }, link: { color: '#347FF5', fontSize: 13, fontWeight: '800' }, button: { backgroundColor: '#347FF5', borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginTop: 28 }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }, signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 }, signupText: { color: '#718098', fontSize: 13 }, pressed: { opacity: 0.75 },
});