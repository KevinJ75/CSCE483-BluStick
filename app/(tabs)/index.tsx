import * as React from "react";
import {Image, StyleSheet, Text, View, Pressable} from "react-native";

const DefaultScreen = () => {
  	
  	return (
    		<View style={styles.defaultScreen}>
      			<Image style={[styles.bluefind1Icon, styles.frameParentPosition]} resizeMode="cover" source={require('@/assets/images/BlueFind.png')} />
      			<View style={[styles.frameParent, styles.frameParentPosition]}>
        				<Pressable style={styles.frame} onPress={()=>{}}>
          					<Text style={[styles.username, styles.usernameFlexBox]}>Username</Text>
        				</Pressable>
        				<View style={[styles.passwordWrapper, styles.wrapperShadowBox]}>
          					<Text style={[styles.password, styles.logInPosition]}>Password</Text>
        				</View>
        				<View style={[styles.logInWrapper, styles.wrapperShadowBox]}>
          					<Text style={[styles.logIn, styles.logInPosition]}>{`Log In `}</Text>
        				</View>
      			</View>
    		</View>);
};

const styles = StyleSheet.create({
  	frameParentPosition: {
    		width: 256,
    		left: 78,
    		position: "absolute"
  	},
  	usernameFlexBox: {
    		opacity: 0.3,
    		textAlign: "left",
    		color: "#000"
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
    		position: "absolute"
  	},
  	bluefind1Icon: {
    		top: 101,
    		height: 256
  	},
  	username: {
    		width: 180,
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
    		backgroundColor: "#d9d9d9",
    		overflow: "hidden"
  	},
  	password: {
    		left: 75,
    		width: 160,
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
    		top: 450,
    		gap: 59
  	},
  	defaultScreen: {
    		backgroundColor: "#3eaeef",
    		flex: 1,
    		width: "100%",
    		height: 917,
    		overflow: "hidden"
  	}
});

export default DefaultScreen;
