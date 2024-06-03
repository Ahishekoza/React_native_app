import { View, Text, ScrollView, Image, KeyboardAvoidingView, Alert, Platform } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CuustomButton";
import {Link, router} from 'expo-router'
import { signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const {setUser,setIsLogged} = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async() => {
    if(!form.email || !form.password){
      Alert.alert("Error", "Please fill all the fields")
    }
    setIsSubmitting(true)
    try {
       const user = await signIn(form.email,form.password)
       setIsSubmitting(false)
       setUser(user)
       
       setIsLogged(true)
       router.replace('/home')
    } catch (error) {
      Alert.alert("Error", error.message)
      setIsSubmitting(false)
    }
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-primary h-full"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center  my-6 px-4">
          <Image source={images.logo} className="w-[115px] h-[35px]" />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Log In To auro
          </Text>
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
            title="Sign-In"
            containerStyles={"mt-7"}
            handlePress={submit}
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
