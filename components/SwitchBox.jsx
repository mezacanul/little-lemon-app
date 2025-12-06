import { View, Text, Switch } from "react-native";

export default function SwitchBox({
    label,
    value,
    onChange,
}) {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
            }}
        >
            <Switch
                value={value}
                onChange={onChange}
                trackColor={{ true: "blue", false: "gray" }}
            />
            <Text>{label}</Text>
        </View>
    );
}
