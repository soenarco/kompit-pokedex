import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MdFavoriteBorder } from 'react-icons/md';

export default function TabsLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Pokedex',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.push('/favorite');
              }}
              style={{ marginRight: 16 }}
            >
              <MdFavoriteBorder size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen 
        name="favorite"
        options={{ title: 'Favorite Pokemon' }}
      />
    </Stack>
  );
}
