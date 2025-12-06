import { Text, TextInput, View } from "react-native";

export default function InputText({
    label,
    placeholder,
    value,
    onChangeText,
    style,
}) {
    return (
        <View style={{ width: "100%" }}>
            <Text
                style={{ marginBottom: 5, color: "gray" }}
            >
                {label}
            </Text>
            <TextInput
                style={[
                    {
                        width: "100%",
                        height: 40,
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                    },
                    style || {},
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}
