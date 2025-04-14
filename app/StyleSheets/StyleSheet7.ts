// import { StyleSheet } from "react-native";

// const styles = StyleSheet.create({
//   frameParentPosition: {
//     width: "100%",
//     paddingHorizontal: 32,
//     justifyContent: "center",
//   },
//   usernameFlexBox: {
//     opacity: 0.3,
//     textAlign: "left",
//     color: "#000",
//     fontSize: 16,
//   },
//   bluefind1Icon: {
//     height: 260,
//     width: 200,
//     alignSelf: "center",
//     marginBottom: 32,
//   },
//   username: {
//     width: '100%',
//     height: 45,
//     fontFamily: "Poppins-Regular",
//     fontSize: 16,
//     textAlign: "left",
//     color: "#000",
//   },
//   frame: {
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     borderRadius: 10,
//     backgroundColor: "#d9d9d9",
//     marginBottom: 16,
//     shadowColor: "rgba(0, 0, 0, 0.25)",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   frameParent: {
//     gap: 16,
//     paddingHorizontal: 24,
//   },
//   defaultScreen: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "#3eaeef",
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//   },
//   link: {
//     marginTop: 18,
//     color: "#007AFF",
//     textAlign: "center",
//   },
// });

// export default styles;


import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  frameParentPosition: {
    width: "100%",
    paddingHorizontal: 32,
    justifyContent: "center",
  },
  usernameFlexBox: {
    textAlign: "left",
    color: "#000",
    fontSize: 16,
  },
  bluefind1Icon: {
    height: 260,
    width: 200,
    alignSelf: "center",
    marginBottom: 32,
  },
  username: {
    width: '100%',
    height: 45,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "left",
    color: "#000",
  },
  frame: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#d9d9d9",
    marginBottom: 16,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  frameParent: {
    gap: 16,
    paddingHorizontal: 24,
  },
  defaultScreen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#3eaeef",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  link: {
    marginTop: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
  signInButton: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;