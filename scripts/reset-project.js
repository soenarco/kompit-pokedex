const fs = require('fs');
const path = require('path');

const root = process.cwd();
const oldDirPath = path.join(root, 'app');
const newDirPath = path.join(root, 'app-example');
const newAppDirPath = path.join(root, 'app');
const screensDirPath = path.join(newAppDirPath, 'screens');
const servicesDirPath = path.join(newAppDirPath, 'services');

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
`;

const homeScreenContent = `import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome to Home Screen</Text>
    </View>
  );
}
`;

const apiContent = `import { z } from 'zodios';

export const api = {
  getPokemonList: async () => {
    // implement API call here
  },
  getPokemonDetail: async (name) => {
    // implement API call here
  },
};
`;

fs.rename(oldDirPath, newDirPath, (error) => {
  if (error) {
    return console.error(`Error renaming directory: ${error}`);
  }

  fs.mkdir(newAppDirPath, { recursive: true }, (error) => {
    if (error) {
      return console.error(`Error creating new app directory: ${error}`);
    }

    const indexPath = path.join(newAppDirPath, 'index.tsx');
    fs.writeFile(indexPath, indexContent, (error) => {
      if (error) {
        return console.error(`Error creating index.tsx: ${error}`);
      }

      const layoutPath = path.join(newAppDirPath, '_layout.tsx');
      fs.writeFile(layoutPath, layoutContent, (error) => {
        if (error) {
          return console.error(`Error creating _layout.tsx: ${error}`);
        }

        fs.mkdir(screensDirPath, { recursive: true }, (error) => {
          if (error) {
            return console.error(`Error creating screens directory: ${error}`);
          }

          const homeScreenPath = path.join(screensDirPath, 'HomeScreen.tsx');
          fs.writeFile(homeScreenPath, homeScreenContent, (error) => {
            if (error) {
              return console.error(`Error creating HomeScreen.tsx: ${error}`);
            }
          });
        });

        fs.mkdir(servicesDirPath, { recursive: true }, (error) => {
          if (error) {
            return console.error(`Error creating services directory: ${error}`);
          }

          const apiPath = path.join(servicesDirPath, 'api.ts');
          fs.writeFile(apiPath, apiContent, (error) => {
            if (error) {
              return console.error(`Error creating api.ts: ${error}`);
            }
          });
        });
      });
    });
  });
});
