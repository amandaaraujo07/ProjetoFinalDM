import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function LoginScreen() {
  const router = useRouter();
  const [senha, setSenha] = useState('');

  const entrarComoAdmin = () => {
    if (senha === '1234') {
      router.push('/admin');
    } else {
      Alert.alert('Acesso Negado', 'Senha incorreta!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        {/* LOGO */}
        <Image 
          source={require('../../assets/images/logo1.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Bloco Cliente */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>Área do Cliente</Text>
          </View>
          <Text style={styles.cardSubtitle}>Veja nossas ofertas e novidades.</Text>
          
          <TouchableOpacity style={styles.btnCliente} onPress={() => router.push('/vitrine')}>
            <Text style={styles.btnText}>Ver Vitrine</Text>
          </TouchableOpacity>
        </View>

        {/* Bloco Gerente */}
        <View style={[styles.card, styles.cardAdmin]}>
          <Text style={styles.cardTitle}>Área Restrita</Text>
          <Text style={styles.cardSubtitle}>Acesso exclusivo para gerência.</Text>
          
          <TextInput 
            placeholder="Digite a senha..." 
            secureTextEntry 
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            placeholderTextColor="#888"
          />
          
          <TouchableOpacity style={styles.btnAdmin} onPress={entrarComoAdmin}>
            <Text style={styles.btnText}>Entrar no Gerenciamento</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#eefffe', // Cor de fundo (Verde Menta Suave)
  },
  
  container: { 
    flex: 1, 
    padding: 25, 
    justifyContent: 'center', 
    backgroundColor: '#eefffe' // Cor de fundo repetida para garantir
  },

  logo: {
    width: '100%',
    height: 220, 
    alignSelf: 'center',
    marginBottom: 30,
    transform: [{ scale: 1.2 }] // O zoom para ela parecer maior
  },

  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, 
  },
  
  cardAdmin: {
    marginTop: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#264653' // Detalhe lateral azul escuro
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5
  },
  
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20
  },

  input: { 
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },

  btnCliente: {
    backgroundColor: '#008080', // Verde Petróleo (Teal)
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4
  },

  btnAdmin: {
    backgroundColor: '#264653', // Azul Escuro
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});