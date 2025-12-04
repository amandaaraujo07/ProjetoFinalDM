import { View, Text, FlatList, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function VitrineScreen() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.log(error);
    else setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Button title="<" onPress={() => router.back()} />
        <Text style={styles.title}>Vitrine</Text>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Imagem do Produto */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.img} 
                  resizeMode="contain" // Isso garante que o pote não seja cortado
                />
              ) : (
                <View style={[styles.img, {backgroundColor: '#ccc'}]} />
              )}
            </View>

            {/* Informações */}
            <View style={styles.infoContainer}>
              <Text style={styles.prodTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              
              <View style={styles.priceRow}>
                <View>
                  <Text style={styles.labelPreco}>À vista no Pix</Text>
                  <Text style={styles.price}>R$ {(item.price ?? 0).toFixed(2).replace('.', ',')}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Fundo igual ao do Login
  container: { flex: 1, 
    backgroundColor: '#eefffe' 
  },

  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#008080', // Cor da marca
    textAlign: 'center',
    flex: 1
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: '#eefffe', // Fundo contínuo (sem barra branca)
  },

  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#008080' // Título na cor da marca
  },
  
  card: { 
    backgroundColor: 'white', 
    marginHorizontal: 15, 
    marginTop: 15, 
    borderRadius: 20, // Bordas mais arredondadas (igual ao login)
    padding: 15,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10
  },

  img: { 
    width: 150, 
    height: 150 
  },
  
  infoContainer: { 
    gap: 5 
  },

  prodTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },

  description: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 10 
  },
  
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 5
  },

  labelPreco: { 
    fontSize: 12, 
    color: '#888' 
  },

  price: { 
    fontSize: 22, 
    color: '#008080', // Preço Verde Petróleo
    fontWeight: 'bold' 
  },
  
  buyButton: {
    backgroundColor: '#008080', // Botão Verde Petróleo
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12, // Arredondado igual ao login
    shadowColor: '#008080',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },

  buyText: { 
    color: 'white', 
    fontWeight: 'bold' 
  }

});