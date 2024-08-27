import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme, ThemeProvider } from '@react-navigation/native';
import { PaperProvider, MD2LightTheme as PaperDefaultTheme, MD2DarkTheme as PaperDarkTheme, useTheme } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? PaperDarkTheme : PaperDefaultTheme;
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const navigationTheme = {
    ...NavigationDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...paperTheme.colors
    },
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  return (
    <PaperProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: navigationTheme.colors.background,
          },
          headerTintColor: navigationTheme.colors.onSurface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <Stack.Screen name='(tabs)'
            options={{
              headerShown: false,
              title: 'ホム'
            }}
          />
          <Stack.Screen
            name="gdetails"
            options={{
              title: '文法情報', // 设置 gdetails 页面显示的标题
            }}
          />
          <Stack.Screen name='+not-found' />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
