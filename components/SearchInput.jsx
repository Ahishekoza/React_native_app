import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({initialQuery}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery||"");

  const handleQuery = () => {
    if (query === "") {
      Alert.alert("Missing query", "Please Input something");
    }
    if (pathname.startsWith("/search")) router.setParams({ query: query });
    else router.push(`/search/${query}`);

    setQuery("")
  };

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="flex-1 text-white font-psemibold text-base"
        value={query}
        onChangeText={(e) => setQuery(e)}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
      />

      <TouchableOpacity onPress={handleQuery}>
        <Image source={icons.search} className="w-6 h-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
