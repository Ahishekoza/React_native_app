import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { GlobalContextProvider } from "../context/GlobalProvider";

const RootLayout = () => {
  return (
    <GlobalContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="search/[query]" options={{ headerShown: false }} />
      </Stack>
    </GlobalContextProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
