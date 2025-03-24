import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  defaultScreen: {
    backgroundColor: "#3eaeef",
    flex: 1,
    width: "100%",
    height: 917,
    overflow: "hidden"
  },
  bluefind1Icon: {
    top: 101,
    height: 256
  },
  frameParentPosition: {
    width: 256,
    left: 78,
    position: "absolute"
  },
  frameParent: {
    top: 450,
    gap: 59
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
  username: {
    width: 180,
    height: 31,
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    opacity: 0.3,
    textAlign: "left",
    color: "#000"
  },
  usernameFlexBox: {
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
  password: {
    left: 75,
    width: 160,
    height: 24,
    opacity: 0.3,
    textAlign: "left",
    color: "#000"
  },
  logInWrapper: {
    backgroundColor: "#60d4ff",
    height: 73
  },
  logIn: {
    left: 99,
    color: "#fff",
    textAlign: "right",
    width: 58
  },
  logInPosition: {
    zIndex: 0,
    top: 22,
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    position: "absolute"
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
  }
});

export default styles;
