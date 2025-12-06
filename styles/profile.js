import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
    avatarContainer: {
        width: "100%",
        marginVertical: 20,
    },
    avatarOptions: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        gap: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100,
        objectFit: "cover",
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 8,
        paddingHorizontal: 10,
    },
});
