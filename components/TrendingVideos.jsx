import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingVideoItem = ({ activeItem, currentItem }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === currentItem.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {playing ? (
        <Video
          source={{ uri: currentItem.video }}
          className="w-52 h-72 rounded-[33px] "
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setPlaying(true)}
          className="relative items-center justify-center"
        >
          <Image
            source={{ uri: currentItem?.thumbnail }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image source={icons.play} className=" absolute w-12 h-12" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const TrendingVideos = ({ posts }) => {
  const [active, setActive] = useState(posts[0]);
  const viewableItemsChanged = ({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingVideoItem activeItem={active} currentItem={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      horizontal
    />
  );
};

export default TrendingVideos;
