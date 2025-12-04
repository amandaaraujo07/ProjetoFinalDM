import { View, Text, FlatList, Image, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react'; // Adicionado useCallback
import { supabase } from '../../lib/supabase';
import { useRouter, useFocusEffect } from 'expo-router'; // Adicionado useFocusEffect

export default function VitrineScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Adicionei loading para ficar mais fluido
  const router = useRouter();

  const fetchProducts = async () => {
    // setLoading(true); // Opcional: Se quiser ver o loading toda vez que entrar
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true }); // Ordenei para os novos aparecerem no fim (ou mude para false para ver primeiro)
      
      if (error) console.log(error);
      else setProducts(data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // --- A MÁGICA ACONTECE AQUI ---
  // Substituímos o useEffect pelo useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  if (loading && products.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Button title="<" onPress={() => router.back()} />
        <Text style={styles.title}>Vitrine</Text>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Imagem do Produto */}
            <View style={styles.imageContainer}>
              {item.image ? (
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.img} 
                  resizeMode="contain" 
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
    backgroundColor: '#eefffe', 
  },

  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#008080' 
  },
  
  card: { 
    backgroundColor: 'white', 
    marginHorizontal: 15, 
    marginTop: 15, 
    borderRadius: 20, 
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
    color: '#008080', 
    fontWeight: 'bold' 
  },
  
  buyButton: {
    backgroundColor: '#008080', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12, 
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