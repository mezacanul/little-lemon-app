import { StyleSheet } from "react-native";

export const mainStyles = StyleSheet.create({
    container: {
        marginBottom: 70,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 15,
        // backgroundColor: "#ffffff",
    },
    backButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 50,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    backButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    logo: {
        // height: 35,
        width: "40%",
        objectFit: "contain",
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 15,
        objectFit: "cover",
    },
    button: {
        width: 80,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
    },
    buttonText: {
        textAlign: "center",
    },
    nameAvatar: {
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "blueviolet",
    },
    nameAvatarSm: {
        width: 35,
        height: 35,
    },
    nameAvatarLg: {
        width: 100,
        height: 100,
    },
    avatarText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    avatarTextSm: {
        fontSize: 16,
    },
    avatarTextLg: {
        fontSize: 42,
    },
});
