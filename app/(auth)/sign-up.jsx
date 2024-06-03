import { View, Text, ScrollView, Image, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CuustomButton"; // Fixed typo from CuustomButton to CustomButton
import { Link, router } from "expo-router";
import { createAccount } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {setUser,setIsLogged} = useGlobalContext()
  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createAccount(form.username, form.email, form.password);
      setIsSubmitting(false);
      setUser(result)
       setIsLogged(true)
      router.replace('/home')
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-primary h-full"
    >
      
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <SafeAreaView className="flex-1">
            <View className="flex-1 justify-center p-4">
              <Image source={images.logo} className="w-28 h-9" />
              <Text className="text-2xl text-white font-semibold mt-10">
                Sign Up To Auro
              </Text>
              <FormField
                title="Username"
                value={form.username}
                handleChangeValue={(e) => setForm({ ...form, username: e })}
                otherStyles="mt-7"
              />
              <FormField
                title="Email"
                value={form.email}
                handleChangeValue={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address"
              />
              <FormField
                title="Password"
                value={form.password}
                handleChangeValue={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-7"
              />
              <CustomButton
                title="Sign-Up"
                containerStyles="mt-7"
                handlePress={submit}
                isLoading={isSubmitting}
              />
              <View className="flex-row justify-center pt-5">
                <Text className="text-lg text-gray-100 font-regular">
                  Have an account already?
                </Text>
                <Link href="/sign-in" className="text-lg font-semibold text-secondary ml-2">
                  SignIn
                </Link>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

export default SignUp;
