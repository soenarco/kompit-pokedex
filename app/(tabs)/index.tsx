import React, { useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import api from '../services/api';

interface Pokemon {
  name: string;
  url: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPokemons();
    }, [])
  );

  const fetchPokemons = async () => {
    try {
      const data = await api.getPokemonList();
      setPokemonList(data.results);
      setFilteredPokemon(data.results);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text === '') {
      setFilteredPokemon(pokemonList);
    } else {
      const filtered = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPokemon(filtered);
    }
  };

  const renderPokemonItem = ({ item }: { item: { name: string; url: string } }) => {
    const pokemonId = item.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
  
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
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredPokemon}
        keyExtractor={(item) => item.name}
        renderItem={renderPokemonItem}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  searchInput: {
    padding: 20,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
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
    fontWeight: 600,
  },
});
