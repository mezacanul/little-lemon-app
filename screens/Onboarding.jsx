import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { onboardingStyles } from "../styles/onboarding";
import { mainStyles } from "../styles/main";
import { useState } from "react";
import { loadHook } from "lattice-design";
import db from "../cache/db";

export default function Login({ navigation }) {
    const [isLoggedIn, setIsLoggedIn] =
        loadHook("useIsLoggedIn");
    const [user, setUser] = loadHook("useUser");
    const [form, setForm] = useState({
        name: "",
        email: "",
    });
    const [errors, setErrors] = useState([]);
    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    function validateForm() {
        const errors = [];
        if (form.name.trim() === "") {
            errors.push("Name is required");
        } else {
            const fullName = form.name.split(" ");
            if (fullName.length < 2) {
                errors.push(
                    "Name must be at least 2 words"
                );
            }
        }
        if (form.email.trim() === "") {
            errors.push("Email is required");
        } else {
            const EMAIL_REGEX =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!EMAIL_REGEX.test(form.email)) {
                errors.push("Invalid email format");
            }
        }
        console.log("errors", errors);

        return errors;
    }

    function handleSubmit() {
        const errors = validateForm();
        if (errors.length > 0) {
            setErrors(errors);
        } else {
            setUser({
                ...user,
                name: form.name,
                email: form.email,
            });
            console.log("form", form);
            db.runSync(
                `
                INSERT INTO profile_details (name, email)
                VALUES (?, ?);
            `,
                [form.name, form.email]
            );
            setIsLoggedIn(true);
            navigation.replace("Home");
        }
    }
    return (
        <View style={onboardingStyles.container}>
            <Image
                source={require("../assets/logo.png")}
                style={mainStyles.logo}
            />
            <TextInput
                style={onboardingStyles.input}
                placeholder="Enter your full name*"
                value={form.name}
                onChangeText={(value) =>
                    handleChange("name", value)
                }
            />
            <TextInput
                style={onboardingStyles.input}
                placeholder="Enter your email*"
                value={form.email}
                onChangeText={(value) =>
                    handleChange("email", value)
                }
            />
            <TouchableOpacity
                style={onboardingStyles.button}
                onPress={handleSubmit}
            >
                <Text style={onboardingStyles.buttonText}>
                    {"Next"}
                </Text>
            </TouchableOpacity>

            {errors.length > 0 && (
                <ErrorMessages errors={errors} />
            )}
        </View>
    );
}

function ErrorMessages({ errors }) {
    return (
        <View style={{ gap: 10 }}>
            {errors.map((error) => (
                <Text
                    key={error}
                    style={{
                        color: "red",
                        fontSize: 12,
                        textAlign: "center",
                    }}
                >
                    {`*${error}`}
                </Text>
            ))}
        </View>
    );
}
