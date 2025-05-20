import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import tw from "twrnc";
import { Linking } from 'react-native';

export default function Explore() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=16fa3d583f514293a1e0fb4c6aca0125');
            setArticles(response.data.articles);
            setError(null);
        } catch (error) {
            console.error(error);
            setError("Failed to load news. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getNews();
    }, []);

    const openArticle = (url) => {
        Linking.openURL(url);
    };

    const renderArticleItem = ({ item }) => (
        <TouchableOpacity
            style={tw`mb-6 bg-white rounded-xl shadow-md overflow-hidden mx-4 my-2`}
            onPress={() => openArticle(item.url)}
        >
            {item.urlToImage ? (
                <Image
                    source={{ uri: item.urlToImage }}
                    style={tw`w-full h-48 object-cover`}
                    resizeMode="cover"
                />
            ) : (
                <View style={tw`w-full h-48 bg-gray-200 flex items-center justify-center`}>
                    <Text style={tw`text-gray-500`}>No image available</Text>
                </View>
            )}

            <View style={tw`p-4`}>
                <Text style={tw`text-lg font-bold mb-2 text-gray-800`}>
                    {item.title}
                </Text>

                <Text style={tw`text-md mb-2`}>
                    {item.author ? `By ${item.author}, ` : "Author Undefined"}
                </Text>

                {item.description && (
                    <Text style={tw`text-gray-600 mb-2 text-sm`}>
                        {item.description}
                    </Text>
                )}

                <Text style={tw`text-blue-500`}>
                    Read More...
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`py-4 px-4 border-b border-gray-200 bg-white`}>
                <Text style={tw`text-2xl font-bold text-gray-800`}>NiggaNews</Text>
            </View>

            {loading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={tw`mt-4 text-gray-600`}>Loading news...</Text>
                </View>
            ) : error ? (
                <View style={tw`flex-1 justify-center items-center p-4`}>
                    <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>
                    <TouchableOpacity
                        style={tw`bg-blue-500 py-2 px-4 rounded-lg`}
                        onPress={getNews}
                    >
                        <Text style={tw`text-white font-medium`}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={(item) => item.url}
                    renderItem={renderArticleItem}
                    contentContainerStyle={tw`py-4`}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}