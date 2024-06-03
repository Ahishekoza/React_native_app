import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CuustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../context/GlobalProvider";
const index = () => {

 const {islogged,loading}= useGlobalContext()


 if(!loading&&islogged) return <Redirect href="/home"/>

  return (
    <SafeAreaView className="bg-primary h-full">
      {/* --need of scroll view // size of the device might change the content display on the screen so for small devices if content goes
       down then we can able to scroll the content */}
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className={"w-full min-h-[84vh] px-4 justify-center  items-center"}>
          <Image
            source={images.logo}
            className=" w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="  max-w-[380px] h-[300px] w-full"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className=" absolute -right-8 -bottom-2 w-[136px] h-[15px] "
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>

          <CustomButton handlePress={()=> router.push('/sign-in')} title={'Continue with Email'} containerStyles={'w-full mt-7'} />
          
        
        </View>
      </ScrollView>
      {/* <StatusBar backgroundColor="#161622" style="light" /> */}
    </SafeAreaView>
  );
};

export default index;
