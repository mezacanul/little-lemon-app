import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import { profileStyles } from "../styles/profile";
import { mainStyles } from "../styles/main";
import InputText from "../components/InputText";
import SwitchBox from "../components/SwitchBox";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { loadHook } from "lattice-design";
import { NameAvatar } from "../components/Header";
import db from "../cache/db";
import { DEFAULT_USER } from "../App";
import theme from "../styles/theme";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";

export default function Profile({ navigation }) {
    const [user, setUser] = loadHook("useUser");
    const [form, setForm] = useState(null);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (user) {
            console.log("user", user);
            setForm({
                ...user,
                phone: user.phone || "",
                image: user.image,
                orderStatus: user.orderStatus == 1 || false,
                passwordChanges:
                    user.passwordChanges == 1 || false,
                specialOffers:
                    user.specialOffers == 1 || false,
                newsletter: user.newsletter == 1 || false,
            });
        }
    }, [user]);

    const saveAvatar = async () => {
        try {
            // Saving new file to document directory
            const fileName =
                "profile_" + Date.now() + ".jpg";
            const newPath = `${Paths.document.uri}${fileName}`;
            const sourceFile = new File(current);
            const destinationFile = new File(newPath);
            await sourceFile.copy(destinationFile);

            return newPath;
        } catch (error) {
            console.log("error", error);
            return "error saving image";
        }
    };

    const removeOldAvatar = async () => {
        try {
            console.log("Deleting old avatar", user.image);

            if (!user.image) {
                return;
            }
            const file = new File(user.image);
            await file.delete();
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleSave = async () => {
        console.log(Date.now());
        console.log("save", form);
        let newImagePath = null;
        if (current) {
            if (user.image) {
                await removeOldAvatar();
            }
            newImagePath = await saveAvatar();
            console.log("newImagePath", newImagePath);
        }
        db.runSync(
            `
            UPDATE profile_details 
            SET name = ?, email = ?, phone = ?, image = ?, orderStatus = ?, passwordChanges = ?, specialOffers = ?, newsletter = ?;
            `,
            [
                form.name,
                form.email,
                form.phone,
                newImagePath,
                form.orderStatus,
                form.passwordChanges,
                form.specialOffers,
                form.newsletter,
            ]
        );
        setUser({
            name: form.name,
            email: form.email,
            phone: form.phone,
            image: newImagePath,
            orderStatus: form.orderStatus,
            passwordChanges: form.passwordChanges,
            specialOffers: form.specialOffers,
            newsletter: form.newsletter,
        });
        setCurrent(null);
        Alert.alert(
            "Success",
            "Profile updated successfully",
            [
                {
                    text: "OK",
                },
            ]
        );
    };

    const handleDiscard = () => {
        console.log("discard", form);
        navigation.replace("Home");
    };

    const handleLogout = () => {
        db.execSync(`
            DELETE FROM profile_details;
            `);
        // db.execSync(`
        //     DROP TABLE profile_details;
        //     `);
        setUser(DEFAULT_USER);
        navigation.navigate("Onboarding");
    };

    return (
        <Layout
            navigation={navigation}
            style={{ padding: 20 }}
        >
            <Text style={styles.subtitle}>
                {"Personal Information"}
            </Text>
            <Avatar
                current={current}
                setCurrent={setCurrent}
            />
            {form && (
                <PersonalInfo
                    form={form}
                    setForm={setForm}
                />
            )}
            {form && (
                <Options
                    form={form}
                    setForm={setForm}
                />
            )}
            <Actions
                onSave={handleSave}
                onDiscard={handleDiscard}
                onLogout={handleLogout}
            />
        </Layout>
    );
}

function Avatar({ current, setCurrent }) {
    const [user, setUser] = loadHook("useUser");

    const handleChangeAvatar = async () => {
        console.log("change avatar");
        // 1. Ask permission
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "Please allow photo access"
            );
            return;
        }

        // 2. Let user pick image
        const result =
            await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

        if (result.canceled) return;
        const pickedUri = result.assets[0].uri;
        setCurrent(pickedUri);

        console.log("pickedUri", pickedUri);
    };

    const handleRemoveAvatar = async () => {
        if (!user.image) {
            Alert.alert(
                "No avatar",
                "You don't have an avatar",
                [
                    {
                        text: "OK",
                    },
                ]
            );
            return;
        }
        try {
            console.log("remove avatar");
            setCurrent(null);
            db.runSync(
                `
            UPDATE profile_details SET image = NULL;
            `
            );
            setUser({
                ...user,
                image: null,
            });
            const file = new File(user.image);
            await file.delete();
            Alert.alert(
                "Success",
                "Avatar removed successfully",
                [
                    {
                        text: "OK",
                    },
                ]
            );
        } catch (error) {
            console.log("error", error);
        }
    };
    return (
        <View style={profileStyles.avatarContainer}>
            <Text
                style={{ marginBottom: 15, color: "gray" }}
            >
                {"Avatar"}
            </Text>
            <View style={profileStyles.avatarOptions}>
                {(current || user.image) && (
                    <Image
                        source={{
                            uri: current || user.image,
                        }}
                        style={profileStyles.avatar}
                    />
                )}
                {!(current || user.image) && (
                    <NameAvatar size="lg" />
                )}
                <TouchableOpacity
                    style={[
                        mainStyles.button,
                        {
                            backgroundColor:
                                theme.colors.green,
                            borderColor: theme.colors.green,
                        },
                    ]}
                    onPress={handleChangeAvatar}
                >
                    <Text
                        style={[
                            mainStyles.buttonText,
                            { color: "white" },
                        ]}
                    >
                        {"Change"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[mainStyles.button]}
                    onPress={handleRemoveAvatar}
                >
                    <Text style={mainStyles.buttonText}>
                        {"Remove"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function PersonalInfo({ form, setForm }) {
    return (
        <View style={{ gap: 20, marginBottom: 20 }}>
            <InputText
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(value) =>
                    setForm({ ...form, name: value })
                }
            />
            <InputText
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(value) =>
                    setForm({ ...form, email: value })
                }
            />
            <InputText
                label="Phone"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={form.phone}
                onChangeText={(value) =>
                    setForm({ ...form, phone: value })
                }
            />
        </View>
    );
}

function Options({ form, setForm }) {
    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value,
        });
    };
    return (
        <View>
            <Text style={styles.subtitle}>
                {"Email Notifications"}
            </Text>
            <View style={{ gap: 10, marginVertical: 20 }}>
                <SwitchBox
                    label="Order Status"
                    value={form.orderStatus}
                    onChange={() =>
                        handleChange(
                            "orderStatus",
                            !form.orderStatus
                        )
                    }
                />
                <SwitchBox
                    label="Password Changes"
                    value={form.passwordChanges}
                    onChange={() =>
                        handleChange(
                            "passwordChanges",
                            !form.passwordChanges
                        )
                    }
                />
                <SwitchBox
                    label="Special Offers"
                    value={form.specialOffers}
                    onChange={() =>
                        handleChange(
                            "specialOffers",
                            !form.specialOffers
                        )
                    }
                />
                <SwitchBox
                    label="Newsletter"
                    value={form.newsletter}
                    onChange={() =>
                        handleChange(
                            "newsletter",
                            !form.newsletter
                        )
                    }
                />
            </View>
        </View>
    );
}

function Actions({ onSave, onDiscard, onLogout }) {
    return (
        <View style={{ gap: 10, marginVertical: 20 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                    style={[
                        mainStyles.button,
                        { width: "50%" },
                    ]}
                    onPress={onDiscard}
                >
                    <Text style={mainStyles.buttonText}>
                        {"Discard Changes"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        mainStyles.button,
                        {
                            width: "50%",
                            backgroundColor:
                                theme.colors.green,
                            borderColor: theme.colors.green,
                        },
                    ]}
                    onPress={onSave}
                >
                    <Text
                        style={[
                            mainStyles.buttonText,
                            { color: "white" },
                        ]}
                    >
                        {"Save Changes"}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    mainStyles.button,
                    {
                        width: "100%",
                        backgroundColor:
                            theme.colors.yellow,
                        // borderColor: "yellow",
                    },
                ]}
                onPress={onLogout}
            >
                <Text style={mainStyles.buttonText}>
                    {"Logout"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
