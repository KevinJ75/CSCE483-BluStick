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
import styles from '@/app/StyleSheets/StyleSheet7';


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
      alert("Sign in failed: password or username is incorrect");
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
              placeholder="email"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.frame}>
            <TextInput
              style={[styles.username, styles.usernameFlexBox]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#666"
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
