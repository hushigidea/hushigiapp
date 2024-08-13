import { Text } from "react-native";
import { ThemedView } from "@/components/ThemedView";

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/secchi.tsx to edit this screen.</Text>
    </ThemedView>
  );
}