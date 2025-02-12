import { View, Text, ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CuustomButton";
import * as DocumentPicker from "expo-document-picker";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createVideoPost } from "../../lib/appwrite";
import { router } from "expo-router";

const create = () => {
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    userId: user.$id,
  });

  const [uploading, setUploading] = useState(false);

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg"]
          : ["video/mp4", "video/gif"],
    });

    console.log(result);

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        });
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      form.prompt === "" ||
      form.title === "" ||
      !form.thumbnail ||
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createVideoPost(form);

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="px-4 my-6" contentContainerStyle={{ flexGrow: 1 }}>
          <Text className="text-2xl text-white font-psemibold">
            Upload Videos
          </Text>

          <View className="flex-1 justify-center">
            <FormField
              title={"Video Title"}
              value={form.title}
              placeholder={"Give your video a catchy title..."}
              handleChangeValue={(e) => setForm({ ...form, title: e })}
              otherStyles={"mt-10"}
            />

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Upload Video
              </Text>

              <TouchableOpacity onPress={() => openPicker("video")}>
                {form.video ? (
                  <Video
                    source={{ uri: form.video.uri }}
                    className="w-full h-64 rounded-2xl"
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                ) : (
                  <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                    <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                      <Image
                        source={icons.upload}
                        resizeMode="contain"
                        alt="upload"
                        className="w-1/2 h-1/2"
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Thumbnail Image
              </Text>

              <TouchableOpacity onPress={() => openPicker("image")}>
                {form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode="cover"
                    className="w-full h-64 rounded-2xl"
                  />
                ) : (
                  <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      alt="upload"
                      className="w-5 h-5"
                    />
                    <Text className="text-sm text-gray-100 font-pmedium">
                      Choose a file
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FormField
              title="AI Prompt"
              value={form.prompt}
              placeholder="The AI prompt of your video...."
              handleChangeValue={(e) => setForm({ ...form, prompt: e })}
              otherStyles="mt-7"
            />

            <CustomButton title="Submit & Publish" handlePress={submit} isLoading={uploading} containerStyles="mt-7" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default create;
