import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface Pokemon {
  name: string;
  id: number;
}

export default function FavoriteScreen() {
  const router = useRouter();
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchFavorites = () => {
      const favorites = storage.getString('favorites') || '[]';
      const favoritesArray = JSON.parse(favorites) as Pokemon[];
      setFavoritePokemons(favoritesArray);
    };

    fetchFavorites();
  }, []);

  const renderFavoriteItem = ({ item }: { item: Pokemon }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/${item.name}`)}
      >
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        <Text style={styles.pokemonName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritePokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderFavoriteItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 16,
        justifyContent: 'space-between',
    },
    listContent: {
        paddingBottom: 16,
    },
    card: {
        width: 164.42,
        height: 221,
        maxWidth: 164.42,
        maxHeight: 221,
        flex: 1,
        padding: 10,
        margin: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#A8A8A8',
        alignItems: 'center',
    },
    pokemonImage: {
        width: 148,
        height: 177,
        marginBottom: 5,
    },
    pokemonName: {
        fontSize: 16,
        textTransform: 'capitalize',
        fontWeight: '600',
    },
});
