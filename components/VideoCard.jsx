import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

const VideoCard = ({
  item: {
    title,
    thumbnail,
    video,
    users: { username, avatar },
  },
}) => {
  const [playing, setPlaying] = useState(false);
  return (
    <View className="flex flex-col items-center px-4 mb-14 ">
      {/* --row--1 */}
      <View className="flex flex-row  items-start">
        {/* --col-1 */}
        <View className="flex justify-center items-center flex-row flex-1">
          {/* --col-1 */}
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          {/* col-2 */}
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        {/* col-2 */}
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {/* --row--2 */}
      {playing ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlaying(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setPlaying(true)}
          activeOpacity={0.7}
          className="relative w-full h-60 mt-3 rounded-xl items-center justify-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="absolute w-12 h-12 "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
