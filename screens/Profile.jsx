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

export default function Profile({ navigation }) {
    const [user, setUser] = loadHook("useUser");
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (user) {
            console.log("user", user);
            setForm({
                ...user,
                phone: user.phone || "",
                orderStatus: user.orderStatus == 1 || false,
                passwordChanges:
                    user.passwordChanges == 1 || false,
                specialOffers:
                    user.specialOffers == 1 || false,
                newsletter: user.newsletter == 1 || false,
            });
        }
    }, [user]);

    const handleSave = () => {
        console.log("save", form);
        db.runSync(
            `
            UPDATE profile_details 
            SET name = ?, email = ?, phone = ?, orderStatus = ?, passwordChanges = ?, specialOffers = ?, newsletter = ?;
            `,
            [
                form.name,
                form.email,
                form.phone,
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
            orderStatus: form.orderStatus,
            passwordChanges: form.passwordChanges,
            specialOffers: form.specialOffers,
            newsletter: form.newsletter,
        });
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
            <Avatar />
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

function Avatar() {
    return (
        <View style={profileStyles.avatarContainer}>
            <Text
                style={{ marginBottom: 15, color: "gray" }}
            >
                {"Avatar"}
            </Text>
            <View style={profileStyles.avatarOptions}>
                {/* <Image
                    source={require("../assets/profile.png")}
                    style={profileStyles.avatar}
                /> */}
                <NameAvatar size="lg" />
                <TouchableOpacity
                    style={[
                        mainStyles.button,
                        {
                            backgroundColor: "green",
                            borderColor: "green",
                        },
                    ]}
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
            <TouchableOpacity
                style={[
                    mainStyles.button,
                    {
                        width: "100%",
                        backgroundColor: "yellow",
                        // borderColor: "yellow",
                    },
                ]}
                onPress={onLogout}
            >
                <Text style={mainStyles.buttonText}>
                    {"Logout"}
                </Text>
            </TouchableOpacity>

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
                            backgroundColor: "green",
                            borderColor: "green",
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
        </View>
    );
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
});
