import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { mainStyles } from "../styles/main";
import { Ionicons } from "@expo/vector-icons";
import { loadHook } from "lattice-design";
import { useState, useEffect } from "react";

const headerItemStyles = StyleSheet.create({
    w30: {
        width: "30%",
    },
});

export default function Header({ navigation }) {
    const [user] = loadHook("useUser");
    const [currentRoute, setCurrentRoute] = useState(null);

    useEffect(() => {
        setCurrentRoute(
            navigation?.getState?.()?.routes?.[
                navigation.getState().index
            ]?.name
        );
    }, [navigation]);

    return (
        <View style={mainStyles.header}>
            {currentRoute && currentRoute !== "Home" ? (
                <BackButton
                    onPress={() => navigation.pop()}
                    style={[headerItemStyles.w30]}
                />
            ) : (
                <Text
                    style={[
                        headerItemStyles.w30,
                        { color: "transparent" },
                    ]}
                >
                    {"."}
                </Text>
            )}
            <Image
                source={require("../assets/logo.png")}
                style={[mainStyles.logo]}
            />
            <TouchableOpacity
                onPress={() => {
                    console.log("profile");
                    navigation.navigate("Profile");
                }}
                style={[
                    headerItemStyles.w30,
                    { alignItems: "flex-end" },
                ]}
            >
                {!user.image && <NameAvatar />}
                {user.image && (
                    <Image
                        source={{ uri: user.image }}
                        style={mainStyles.profileImage}
                    />
                )}
            </TouchableOpacity>
        </View>
    );
}

export function NameAvatar({ size = "sm" }) {
    const [user] = loadHook("useUser");
    return (
        <View
            style={[
                mainStyles.nameAvatar,
                size === "sm"
                    ? mainStyles.nameAvatarSm
                    : size === "lg"
                    ? mainStyles.nameAvatarLg
                    : {},
            ]}
        >
            <Text
                style={[
                    mainStyles.avatarText,
                    size === "sm"
                        ? mainStyles.avatarTextSm
                        : size === "lg"
                        ? mainStyles.avatarTextLg
                        : {},
                ]}
            >
                {user.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()}
            </Text>
        </View>
    );
}

function BackButton({ onPress, style }) {
    return (
        <View style={[style]}>
            <TouchableOpacity
                style={[mainStyles.backButton]}
                onPress={onPress}
            >
                <Ionicons
                    name="arrow-back"
                    // size={20}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    );
}
