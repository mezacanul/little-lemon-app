import {
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import Layout from "../components/Layout";
import { homeStyles } from "../styles/home";
import InputText from "../components/InputText";
import { useEffect, useState } from "react";
import axios from "axios";
import db from "../cache/db";
import { loadHook } from "lattice-design";

const PRODUCTS_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export default function Home({ navigation }) {
    const [query, setQuery] = useState("");
    return (
        <Layout navigation={navigation}>
            <Hero
                query={query}
                setQuery={setQuery}
            />
            <Categories />
            <Products query={query} />
        </Layout>
    );
}

function Hero({ query, setQuery }) {
    const [loading, setLoading] = useState(true);
    return (
        <View style={homeStyles.hero}>
            <Text style={homeStyles.heroTitle}>
                Little Lemon
            </Text>

            <View style={homeStyles.heroContent}>
                <View style={homeStyles.heroText}>
                    <Text style={homeStyles.heroSubtitle}>
                        Chicago
                    </Text>
                    <Text style={{ color: "white" }}>
                        {
                            "We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist."
                        }
                    </Text>
                </View>
                <Image
                    source={require("../assets/hero.png")}
                    style={homeStyles.heroImage}
                    onLoadEnd={() => setLoading(false)}
                />
                {loading && <ActivityIndicator />}
            </View>

            <InputText
                style={homeStyles.heroSearch}
                placeholder="Search for a product"
                value={query}
                onChangeText={setQuery}
            />
        </View>
    );
}

function Categories() {
    const categories = [
        "Starters",
        "Mains",
        "Desserts",
        "Drinks",
        "Breakfast",
        "Lunch",
        "Dinner",
        "Other",
    ];
    return (
        <View style={homeStyles.categories}>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                {"ORDER FOR DELIVERY!"}
            </Text>

            <FlatList
                data={categories}
                renderItem={CategoryItem}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 10,
                    marginTop: 20,
                }}
            />
        </View>
    );
}

function CategoryItem({ item }) {
    return (
        <TouchableOpacity style={homeStyles.categoryItem}>
            <Text style={homeStyles.categoryItemText}>
                {item}
            </Text>
        </TouchableOpacity>
    );
}

function Products({ query }) {
    const [products, setProducts] = loadHook("useProducts");

    useEffect(() => {
        const productsData = db.getAllSync(`
            SELECT * FROM products;
        `);
        console.log("productsData", productsData);
        // return;
        if (productsData.length === 0) {
            axios
                .get(PRODUCTS_URL)
                .then((response) => {
                    setProducts(response.data.menu);
                    db.withTransactionSync(() => {
                        response.data.menu.forEach((prd) =>
                            db.runSync(
                                "INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
                                prd.name,
                                prd.description,
                                prd.price,
                                prd.image,
                                prd.category
                            )
                        );
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            setProducts(productsData);
        }
    }, []);

    // useEffect(() => {
    //     if (query) {
    //         setProducts(
    //             products.filter((product) =>
    //                 product.name
    //                     .toLowerCase()
    //                     .includes(query.toLowerCase())
    //             )
    //         );
    //     } else {
    //         setProducts(productsData);
    //     }
    // }, [query]);

    return (
        <View style={{ width: "100%" }}>
            {products
                .filter((product) =>
                    product.name
                        .toLowerCase()
                        .includes(query.toLowerCase())
                )
                .map((product) => (
                    <ProductItem
                        key={product.name}
                        item={product}
                    />
                ))}
        </View>
    );
}

function ProductItem({ item }) {
    const [loading, setLoading] = useState(true);
    const imageMap = {
        keys: ["lemonDessert.jpg", "grilledFish.jpg"],
        map: {
            "lemonDessert.jpg": require("../assets/lemonDessert.jpg"),
            "grilledFish.jpg": require("../assets/grilledFish.jpg"),
        },
    };
    const remotePrefix =
        "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/";
    return (
        <View style={homeStyles.productItem}>
            <View style={{ width: "70%", gap: 10 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                    }}
                >
                    {item.name}
                </Text>
                <Text>{item.description}</Text>
                <Text style={{ fontWeight: "bold" }}>
                    {`$${item.price}`}
                </Text>
            </View>
            <Image
                source={
                    imageMap.keys.includes(item.image)
                        ? imageMap.map[item.image]
                        : {
                              uri: `${remotePrefix}${item.image}`,
                          }
                }
                style={homeStyles.productImage}
                onLoadEnd={() => setLoading(false)}
            />
            {loading && <ActivityIndicator />}
        </View>
    );
}
