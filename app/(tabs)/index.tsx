// DefaultScreen.tsx
import * as React from "react";
import { Image, Text, View, Pressable } from "react-native";
//import styles from "./StyleSheets/StyleSheet1"; 
import styles from "../StyleSheets/StyleSheet1"; // Adjusted path

const DefaultScreen = () => {
  return (
    <View style={styles.defaultScreen}>
      <Image
        style={[styles.bluefind1Icon, styles.frameParentPosition]}
        resizeMode="cover"
        source={require('@/assets/images/BlueFind.png')}
      />
      <View style={[styles.frameParent, styles.frameParentPosition]}>
        <Pressable style={styles.frame} onPress={() => {}}>
          <Text style={[styles.username, styles.usernameFlexBox]}>Username</Text>
        </Pressable>
        <View style={[styles.passwordWrapper, styles.wrapperShadowBox]}>
          <Text style={[styles.password, styles.logInPosition]}>Password</Text>
        </View>
        <View style={[styles.logInWrapper, styles.wrapperShadowBox]}>
          <Text style={[styles.logIn, styles.logInPosition]}>{`Log In `}</Text>
        </View>
      </View>
    </View>
  );
};

export default DefaultScreen;
