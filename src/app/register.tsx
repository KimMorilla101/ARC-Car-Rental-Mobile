import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()}><Text style={styles.back}>‹  Back to sign in</Text></Pressable>
          <View style={styles.logoRow}><View style={styles.mark}><Text style={styles.markText}>A</Text></View><Text style={styles.logo}>ARC <Text style={styles.logoAccent}>RIDE</Text></Text></View>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join ARC Ride and make your next trip feel effortless.</Text>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput style={styles.input} placeholder="Juan Dela Cruz" placeholderTextColor="#8B9AB0" value={fullName} onChangeText={setFullName} />
          <Text style={styles.label}>EMAIL ADDRESS</Text>
          <TextInput style={styles.input} placeholder="you@example.com" placeholderTextColor="#8B9AB0" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Text style={styles.label}>PASSWORD</Text>
          <TextInput style={styles.input} placeholder="At least 8 characters" placeholderTextColor="#8B9AB0" value={password} onChangeText={setPassword} secureTextEntry />
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={() => router.replace('/home' as never)}><Text style={styles.buttonText}>Create account  →</Text></Pressable>
          <View style={styles.signinRow}><Text style={styles.signinText}>Already have an account? </Text><Pressable onPress={() => router.push('/login')}><Text style={styles.link}>Sign in</Text></Pressable></View>
          <Text style={styles.terms}>By creating an account, you agree to our Terms of Service and Privacy Policy.</Text>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FC' }, safeArea: { flex: 1 }, scrollContent: { flexGrow: 1, padding: 28, paddingTop: 18, justifyContent: 'center' },
  back: { color: '#347FF5', fontSize: 15, fontWeight: '700', marginBottom: 30 }, logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 }, mark: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#347FF5', alignItems: 'center', justifyContent: 'center' }, markText: { color: '#FFFFFF', fontSize: 21, fontWeight: '900' }, logo: { color: '#13233C', fontSize: 18, fontWeight: '800', letterSpacing: 1, marginLeft: 10 }, logoAccent: { color: '#347FF5' }, title: { color: '#10213A', fontSize: 34, fontWeight: '800', letterSpacing: -1, marginBottom: 8 }, subtitle: { color: '#708099', fontSize: 15, lineHeight: 22, marginBottom: 22 }, label: { color: '#63758F', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginTop: 16 }, input: { backgroundColor: '#FFFFFF', borderRadius: 13, paddingHorizontal: 16, paddingVertical: 16, color: '#14243B', fontSize: 15, borderWidth: 1, borderColor: '#DCE5F0' }, button: { backgroundColor: '#347FF5', borderRadius: 14, paddingVertical: 17, alignItems: 'center', marginTop: 28 }, buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' }, signinRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 }, signinText: { color: '#718098', fontSize: 13 }, link: { color: '#347FF5', fontSize: 13, fontWeight: '800' }, terms: { color: '#8A98AA', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 30 }, pressed: { opacity: 0.75 },
});