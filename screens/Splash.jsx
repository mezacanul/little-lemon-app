import { Image, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { loadHook } from "lattice-design";
import { useEffect } from "react";
import db from "../cache/db";

export default function Splash({ navigation }) {
    const [user, setUser] = loadHook("useUser");
    const [isLoggedIn, setIsLoggedIn] =
        loadHook("useIsLoggedIn");

    useEffect(() => {
        const profile_details = db.getFirstSync(`
            SELECT * FROM profile_details;
        `);
        console.log("profile_details", profile_details);
        setTimeout(() => {
            if (profile_details) {
                setUser({
                    name: profile_details.name,
                    email: profile_details.email,
                    ...profile_details,
                });
                setIsLoggedIn(true);
                navigation.replace("Home");
            } else {
                setIsLoggedIn(false);
                navigation.replace("Onboarding");
            }
        }, 1000);
    }, []);
    return (
        <View style={splashStyles.container}>
            <Image
                source={require("../assets/logo-splash.png")}
                style={splashStyles.logo}
            />
        </View>
    );
}

const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: "20%",
        objectFit: "contain",
    },
});
