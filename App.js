import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Splash from "./screens/Splash";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import { loadHook, Nexus, Singleton } from "lattice-design";
import { useEffect, useState } from "react";
import db from "./cache/db";

const Stack = createNativeStackNavigator();

export const DEFAULT_USER = {
    name: "",
    email: "",
    phone: "",
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
};

Nexus({
    useUser: Singleton(DEFAULT_USER),
    useIsLoggedIn: Singleton(null),
    useProducts: Singleton([]),
});

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={"Splash"}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                />
                <Stack.Screen
                    name="Onboarding"
                    component={Onboarding}
                />

                <Stack.Screen
                    name="Profile"
                    component={Profile}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
