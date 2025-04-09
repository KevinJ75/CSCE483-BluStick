import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [sign, setSign] = useState(false); // false = Sign In, true = Sign Up

  const signUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Update display name after account creation.
      await updateProfile(userCredential.user, { displayName: name });
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Sign in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.defaultScreen}>
      <KeyboardAvoidingView behavior="padding">
        <Image
          style={[styles.bluefind1Icon, styles.frameParentPosition]}
          resizeMode="cover"
          source={require("@/assets/images/BlueFind.png")}
        />
        <View style={[styles.frameParent, styles.frameParentPosition]}>
          <View style={styles.frame}>
            <TextInput
              style={[styles.username, styles.usernameFlexBox]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
            />
          </View>
          <View style={styles.frame}>
            <TextInput
              style={[styles.username, styles.usernameFlexBox]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
            />
          </View>
          <View>
            {sign ? (
              <>
                <View style={styles.frame}>
                  <TextInput
                    style={[styles.username, styles.usernameFlexBox]}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    keyboardType="default"
                    placeholder="Full Name"
                  />
                </View>
                <Button onPress={signUp} title="Sign Up" />
                <Text style={styles.link} onPress={() => setSign(false)}>
                  Sign In
                </Text>
              </>
            ) : (
              <>
                <Button onPress={signIn} title="Sign In" />
                <Text style={styles.link} onPress={() => setSign(true)}>
                  Create an Account
                </Text>
              </>
            )}
            {loading && <ActivityIndicator size="small" />}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  frameParentPosition: {
    width: 256,
    left: "16%",
    justifyContent: "center",
    position: "relative",
  },
  usernameFlexBox: {
    opacity: 0.3,
    textAlign: "left",
    color: "#000",
  },
  bluefind1Icon: {
    height: 256,
  },
  username: {
    width: "100%",
    height: 31,
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    opacity: 0.3,
    textAlign: "left",
    color: "#000",
  },
  frame: {
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    borderRadius: 10,
    shadowOpacity: 1,
    elevation: 4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(0, 0, 0, 0.25)",
    backgroundColor: "#d9d9d9",
    overflow: "hidden",
    marginBottom: 10,
  },
  frameParent: {
    gap: 30,
  },
  defaultScreen: {
    backgroundColor: "#3eaeef",
    flex: 1,
    width: "100%",
    overflow: "scroll",
    justifyContent: "center",
  },
  link: {
    marginTop: 18,
    color: "#007AFF",
    textAlign: "center",
  },
});
