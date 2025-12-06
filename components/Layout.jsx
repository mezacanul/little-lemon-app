import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import { mainStyles } from "../styles/main";
import { ScrollView } from "react-native";

export default function Layout({
    navigation,
    children,
    style,
}) {
    return (
        <SafeAreaView>
            <Header navigation={navigation} />
            <ScrollView
                style={[mainStyles.container, style || {}]}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </SafeAreaView>
    );
}
