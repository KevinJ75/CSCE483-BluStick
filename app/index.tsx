import { useState } from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView, TextInput, Button, ActivityIndicator, Image, Pressable, ScrollView } from "react-native"
import auth, { firebase } from "@react-native-firebase/auth"
import { FirebaseError } from 'firebase/app'
import * as React from "react";

export default function loginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const signUp = async () => {
        setLoading(true);
        try {
            await auth().createUserWithEmailAndPassword(email, password).then(() =>
                {
                    auth().currentUser?.updateProfile({
                        displayName: name,
                    });
                }
            );
            alert('Check your emails!');
            await auth().currentUser?.updateProfile({
                displayName: name,
            });
        } catch (e: any) {
            const err = e as FirebaseError;
            alert('Registration failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async () => {
        setLoading(true);
        try {
            await auth().signInWithEmailAndPassword(email, password);
            alert('Check your emails!');
        } catch (e: any) {
            const err = e as FirebaseError;
            alert('Sign in failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.defaultScreen}>
            <KeyboardAvoidingView behavior="padding">
                <Image style={[styles.bluefind1Icon, styles.frameParentPosition]} resizeMode="cover" source={require('@/assets/images/BlueFind.png')} />
                <View style={[styles.frameParent, styles.frameParentPosition]}>
                        <View style={styles.frame}>
                            <TextInput style={[styles.username, styles.usernameFlexBox]} 
                                value={email} 
                                onChangeText={setEmail} 
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder="Email"
                            />
                        </View>
                        <View style={[styles.frame]}>
                            <TextInput style={[styles.username, styles.usernameFlexBox]}
                                value={password} 
                                onChangeText={setPassword} 
                                secureTextEntry
                                placeholder="Password"
                            />
                        </View>
                        <View >
                            {loading ? (
                                // <ActivityIndicator size={'small'} style={{ margin: 28 }} />
                                <>
                                    <View style={styles.frame}>
                                        <TextInput style={[styles.username, styles.usernameFlexBox]} 
                                        value={name} 
                                        onChangeText={setName} 
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        placeholder="Full Name"
                                        />
                                    </View>
                                    <Button onPress={signUp} title="Sign Up" />
                                    <Text style={styles.link} onPress={() => setLoading(false)}>
                                        Sign In
                                    </Text>     
                                                       
                                </>
                            ) : (
                                <>
                                    <Button onPress={signIn} title="Sign In" />
                                    <Text style={styles.link} onPress={() => setLoading(true)}>
                                        Create an Account
                                    </Text>
                                </>
                            )}
                        </View>
                </View>
            </KeyboardAvoidingView>
        </View>

    );
}

// const styles = StyleSheet.create({
//     container: {
//         marginHorizontal: 20,
//         flex: 1,
//         justifyContent: 'center',
//     },
//     input: {
//         marginVertical: 4,
//         height: 50,
//         borderWidth: 1,
//         borderRadius: 4,
//         padding: 10,
//         backgroundColor: '#fff',
//     },
// });

const styles = StyleSheet.create({
    frameParentPosition: {
          width: 256,
          left: '16%',
        justifyContent: 'center',
          position: 'relative',
    },
    usernameFlexBox: {
          opacity: 0.3,
          textAlign: "left",
          color: "#000",
    },
    wrapperShadowBox: {
          paddingBottom: 21,
          paddingRight: 20,
          paddingTop: 22,
          paddingLeft: 76,
          flexDirection: "row",
          borderRadius: 10,
          shadowOpacity: 1,
          elevation: 4,
          shadowRadius: 4,
          shadowOffset: {
                width: 0,
                height: 4
          },
          shadowColor: "rgba(0, 0, 0, 0.25)",
          alignSelf: "stretch",
          overflow: "hidden"
    },
    logInPosition: {
          zIndex: 0,
          top: 22,
          fontFamily: "Poppins-Regular",
          fontSize: 20,
          position: "absolute",
          width: 180
    },
    bluefind1Icon: {
        //   top: 101,
          height: 256
    },
    username: {
          width: '100%',
          height: 31,
          fontFamily: "Poppins-Regular",
          fontSize: 20,
          opacity: 0.3,
          textAlign: "left",
          color: "#000"
    },
    frame: {
          paddingTop: 18,
          paddingBottom: 18,
        //   paddingLeft: 76,
          flexDirection: "row",
          borderRadius: 10,
          shadowOpacity: 1,
          elevation: 4,
          shadowRadius: 4,
          shadowOffset: {
                width: 0,
                height: 4
          },
          shadowColor: "rgba(0, 0, 0, 0.25)",
        //   alignSelf: "stretch",
          backgroundColor: "#d9d9d9",
          overflow: "hidden"
    },
    password: {
        //   left: 75,
          width: '100%',
          height: 24,
          opacity: 0.3,
          textAlign: "left",
          color: "#000"
    },
    passwordWrapper: {
          height: 67,
          backgroundColor: "#d9d9d9",
          paddingRight: 20,
          paddingTop: 22
    },
    logIn: {
          left: 99,
          color: "#fff",
          textAlign: "right",
          width: 58
    },
    logInWrapper: {
          backgroundColor: "#60d4ff",
          height: 73
    },
    frameParent: {
        //   top: 450,
          gap: 30
    },
    defaultScreen: {
          backgroundColor: "#3eaeef",
          flex: 1,
          width: "100%",
        //   height: '100%',
          overflow: 'scroll',
          justifyContent: 'center'
    },
    link: {
        marginTop: 18,
        color: "#007AFF",
        textAlign: "center",
    },
});
