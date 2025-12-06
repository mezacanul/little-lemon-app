import { StyleSheet } from "react-native";
import theme from "./theme";

export const onboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    input: {
        width: "70%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    text: {
        color: theme.colors.green,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        width: "50%",
    },
    button: {
        width: "40%",
        backgroundColor: theme.colors.green,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        textAlign: "center",
    },
});
