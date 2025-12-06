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
import { toTitleCase } from "../utils/main";
import theme from "../styles/theme";

const PRODUCTS_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export default function Home({ navigation }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState([]);

    return (
        <Layout navigation={navigation}>
            <Hero
                query={query}
                setQuery={setQuery}
            />
            <Categories
                filter={filter}
                setFilter={setFilter}
            />
            <Products
                query={query}
                filter={filter}
            />
        </Layout>
    );
}

function Hero({ query, setQuery }) {
    const [loading, setLoading] = useState(true);
    return (
        <View style={homeStyles.hero}>
            <Text style={homeStyles.heroTitle}>
                {"Little Lemon"}
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

function Categories({ filter, setFilter }) {
    const categories = [
        "Starters",
        "Mains",
        "Desserts",
        "Drinks",
        "Sides",
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
                renderItem={({ item }) => (
                    <CategoryItem
                        item={item}
                        filter={filter}
                        setFilter={setFilter}
                    />
                )}
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

function CategoryItem({ item, filter, setFilter }) {
    const handleFilter = () => {
        if (filter.includes(item)) {
            setFilter(filter.filter((f) => f !== item));
        } else {
            setFilter([...filter, item]);
        }
    };

    const selectedStyles = {
        container: {
            backgroundColor: theme.colors.green,
        },
        text: {
            color: "white",
        },
    };

    return (
        <TouchableOpacity
            style={[
                homeStyles.categoryItem,
                filter.includes(item) &&
                    selectedStyles.container,
            ]}
            onPress={handleFilter}
        >
            <Text
                style={[
                    homeStyles.categoryItemText,
                    filter.includes(item) &&
                        selectedStyles.text,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );
}

function Products({ query, filter }) {
    const [products, setProducts] = loadHook("useProducts");
    const [filtered, setFiltered] = useState(null);

    useEffect(() => {
        const newFiltered = products
            .filter(
                (product) =>
                    filter.length === 0 ||
                    filter.includes(
                        toTitleCase(product.category)
                    )
            )
            .filter((product) =>
                product.name
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );
        setFiltered(newFiltered);
    }, [query, filter]);

    useEffect(() => {
        const productsData = db.getAllSync(`
            SELECT * FROM products;
        `);
        // console.log("productsData", productsData);
        // return;
        if (productsData.length === 0) {
            axios
                .get(PRODUCTS_URL)
                .then((response) => {
                    setProducts(response.data.menu);
                    setFiltered(response.data.menu);
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
            setFiltered(productsData);
        }
    }, []);

    return (
        <View style={{ width: "100%" }}>
            {filtered &&
                filtered.map((product) => (
                    <ProductItem
                        key={product.name}
                        item={product}
                    />
                ))}

            {filtered && filtered.length === 0 && (
                <Text
                    style={{
                        textAlign: "center",
                        paddingVertical: 50,
                    }}
                >
                    {"No products found"}
                </Text>
            )}
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
                <Text
                    style={{
                        fontWeight: "bold",
                        color: theme.colors.green,
                    }}
                >
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
