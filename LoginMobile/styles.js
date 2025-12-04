import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#d32f2f",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  input: {
    width: "100%",
    padding: 12,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#d32f2f",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  message: {
    marginTop: 15,
    fontSize: 14,
    textAlign: "center",
  },
});
