import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  Keyboard,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Product } from "../../types/product";

export default function Admin() {
  // --- ESTADOS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Formulário
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // --- 1. BUSCAR PRODUTOS NO SUPABASE (READ) ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error: dbError } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (dbError) throw dbError;

      setProducts(data || []);
    } catch (err: any) {
      Alert.alert("Erro", "Falha ao buscar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // --- FUNÇÕES DE CONTROLE ---
  const clearForm = () => {
    setProductId("");
    setTitle("");
    setPrice("");
    setDescription("");
    setImage("");
    Keyboard.dismiss();
  };

  const handleEditItem = (item: Product) => {
    setProductId(item.id.toString());
    setTitle(item.title);
    setPrice(item.price.toString());
    setDescription(item.description || "");
    setImage(item.image || "");
  };

  const handleLogout = () => {
    router.replace("/");
  };

  // --- 2. ADICIONAR (CREATE) ---
  const handleAddProduct = async () => {
    if (!title || !price || !description || !image) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos para adicionar um produto."
      );
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        title,
        price: parseFloat(price),
        description,
        category: "app-add",
        image: image,
      },
    ]);

    if (error) Alert.alert("Erro", error.message);
    else {
      Alert.alert("Sucesso", "Produto adicionado!");
      clearForm();
      fetchProducts();
    }
  };

  // --- 3. ATUALIZAR (UPDATE) ---
  const handleUpdateProduct = async () => {
    if (!productId) {
      Alert.alert("Atenção", "Insira o ID do produto para atualizar.");
      return;
    }

    const updateObject: {
      title?: string;
      price?: number;
      description?: string;
      image?: string;
    } = {};
    if (title) updateObject.title = title;
    if (price) updateObject.price = parseFloat(price);
    if (description) updateObject.description = description;
    if (image) updateObject.image = image;

    if (Object.keys(updateObject).length === 0) {
      Alert.alert("Atenção", "Preencha pelo menos um campo para atualizar.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update(updateObject)
      .eq("id", productId);

    if (error) Alert.alert("Erro", error.message);
    else {
      Alert.alert("Sucesso", "Produto atualizado!");
      clearForm();
      fetchProducts();
    }
  };

  // --- 4. DELETAR (DELETE) ---
  const handleDeleteProduct = async () => {
    if (!productId) {
      Alert.alert("Atenção", "Insira o ID do produto para deletar.");
      return;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) Alert.alert("Erro", error.message);
    else {
      Alert.alert("Sucesso", "Produto deletado!");
      clearForm();
      fetchProducts();
    }
  };

  // --- RENDERIZAÇÃO DO CABEÇALHO ---
  // Mantemos como uma função que retorna o JSX
  const renderFormHeader = () => {
    return (
      <View style={styles.formContainer}>
        {/* Barra Superior */}
        <View style={styles.topBar}>
          <Text style={styles.headerTitle}>Painel Gerencial</Text>
          <TouchableOpacity style={styles.btnSair} onPress={handleLogout}>
            <Text style={styles.btnSairText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Cartão do Formulário */}
        <View style={styles.cardForm}>
          <Text style={styles.sectionTitle}>Gerenciar Produto</Text>
          <Text style={styles.hintText}>
            Preencha ou clique na lista abaixo para editar.
          </Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              style={[
                styles.input,
                { width: 70, backgroundColor: "#e9ecef" },
              ]}
              placeholder="ID"
              value={productId}
              onChangeText={setProductId}
              keyboardType="numeric"
              editable={false} // ID geralmente não deve ser editado manualmente
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Título do Produto"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Preço (ex: 29.90)"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="URL da Imagem"
            value={image}
            onChangeText={setImage}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Descrição..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Botões de Ação */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#008080" }]}
              onPress={handleAddProduct}
            >
              <Text style={styles.btnText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#D67A4A" }]}
              onPress={handleUpdateProduct}
            >
              <Text style={styles.btnText}>Atualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#d9534f" }]}
              onPress={handleDeleteProduct}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={clearForm}
            style={{ marginTop: 15, alignItems: "center" }}
          >
            <Text
              style={{ color: "#666", textDecorationLine: "underline" }}
            >
              Limpar Campos
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeader}>Lista de Estoque</Text>
      </View>
    );
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderFormHeader()} 
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEditItem(item)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.productCard,
                productId === item.id.toString() && {
                  borderColor: "#008080",
                  borderWidth: 2,
                },
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />

              <View style={styles.infoContainer}>
                <View
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#555",
                      backgroundColor: "#eee",
                      paddingHorizontal: 6,
                      marginRight: 5,
                    }}
                  >
                    #{item.id}
                  </Text>
                  <Text style={styles.productTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
                <Text style={styles.productPrice}>
                  R$ {item.price?.toFixed(2)}
                </Text>
                <Text style={styles.productDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eefffe",
    paddingTop: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    padding: 20,
    paddingBottom: 5,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#264653",
  },

  btnSair: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  btnSairText: {
    color: "white",
    fontWeight: "bold",
  },

  cardForm: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 5,
  },

  hintText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    marginTop: 5,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 10,
    marginTop: 10,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "transparent",
  },

  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#f0f0f0",
  },

  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008080",
  },

  productDesc: {
    fontSize: 12,
    color: "#888",
  },
});