import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
    hero: {
        width: "100%",
        backgroundColor: "green",
        // height: 200,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    heroImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        objectFit: "cover",
    },
    heroTitle: {
        fontSize: 35,
        fontWeight: "bold",
        color: "yellow",
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    heroContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "start",
        width: "100%",
    },
    heroText: {
        width: "50%",
    },
    heroButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 50,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
    },
    heroSearch: {
        backgroundColor: "#rgba(255, 255, 255, 0.7)",
        borderColor: "transparent",
    },
    categories: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
    },
    categoriesList: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
    },
    categoryItem: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        backgroundColor: "lightgray",
    },
    categoryItemText: {
        fontWeight: "bold",
    },
    productItem: {
        width: "100%",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "lightgray",
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        objectFit: "cover",
    },
});
