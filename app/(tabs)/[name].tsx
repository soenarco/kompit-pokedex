import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { MdFavoriteBorder, MdOutlineFavorite } from 'react-icons/md';
import api from '../services/api';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface Ability {
  ability: {
    name: string;
  };
}

interface FavoritePokemon {
  name: string;
  id: number;
}

export default function DetailScreen() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (pokemon) {
      navigation.setOptions({
        title: "Pokemon Detail",
      });
    }
  }, [pokemon, navigation]);

  useEffect(() => {
    if (name) {
      fetchPokemonDetail(name as string);
    }
  }, [name]);

  useEffect(() => {
    if (pokemon) {
      checkIfFavorite(pokemon.id);
    }
  }, [pokemon]);

  const fetchPokemonDetail = async (name: string) => {
    try {
      const data = await api.getPokemonDetail({ params: { name } });
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching pokemon detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = (id: number) => {
    const favorites = storage.getString('favorites') || '[]';
    const favoritesArray = JSON.parse(favorites) as FavoritePokemon[];
    const isFavorite = favoritesArray.some((fav) => fav.id === id);
    setIsFavorite(isFavorite);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite();
    } else {
      saveFavorite();
    }
  };

  const saveFavorite = () => {
    const favorites = storage.getString('favorites') || '[]';
    const favoritesArray = JSON.parse(favorites) as FavoritePokemon[];

    const isAlreadyFavorite = favoritesArray.some((fav) => fav.id === pokemon.id);

    if (!isAlreadyFavorite) {
      favoritesArray.push({ name: pokemon.name, id: pokemon.id });
      storage.set('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(true);
    }
  };

  const removeFavorite = () => {
    const favorites = storage.getString('favorites') || '[]';
    const favoritesArray = JSON.parse(favorites) as FavoritePokemon[];
    const updatedFavorites = favoritesArray.filter((fav) => fav.id !== pokemon.id);
    storage.set('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text>Pokemon not found.</Text>
      </View>
    );
  }

  const spriteUrls = Object.values(pokemon.sprites).filter(url => url !== null) as string[];

  return (
    <View style={styles.container}>
      <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonImage} />
      <View style={styles.nameContainer}>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
          {isFavorite ? (
            <MdOutlineFavorite size={24} color="#FF0000" />
          ) : (
            <MdFavoriteBorder size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.spriteTitle}>Sprite Gallery</Text>
      <View style={styles.spriteGallery}>
        {spriteUrls.map((url, index) => (
          <Image key={index} source={{ uri: url }} style={styles.spriteImage} />
        ))}
      </View>
      <Text style={styles.pokemonInfo}>Abilities:</Text>
      {pokemon.abilities.map((abilityInfo: Ability) => (
        <Text key={abilityInfo.ability.name} style={styles.pokemonAbility}>
          {abilityInfo.ability.name}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonImage: {
    width: 305,
    height: 236,
    marginBottom: 16,
  },
  nameContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    flex: 1,
  },
  favoriteIcon: {
    padding: 5,
  },
  spriteTitle: {
    paddingLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  spriteGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  spriteImage: {
    width: 158,
    height: 115,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pokemonInfo: {
    paddingLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  pokemonAbility: {
    paddingLeft: 16,
    fontSize: 16,
    marginBottom: 5,
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },
});
