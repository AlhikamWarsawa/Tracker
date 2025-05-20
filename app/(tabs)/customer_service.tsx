import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ImageBackground, ActivityIndicator, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import tw from "twrnc";
import { GoogleGenAI } from "@google/genai";

const Customer = () => {

    const [problem, setProblem] = useState("");
const [solution, setSolution] = useState("");
const [isLoading, setIsLoading] = useState(false);

const getAISolution = async (problemText: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: "AIzaSyBvLyOKr9gVWte2ATyOGzYCvFhCpO9WCmU" });

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: `Saya Ingin Bertanya Tentang: ${problemText}`,
            });

            return response.text;
        } catch (error) {
            console.error("Error saat mengakses AI:", error);
            return "Maaf, tidak dapat menghasilkan solusi saat ini.";
        }
    };

    // Fungsi untuk mendapatkan solusi
    const handleGetSolution = async () => {
        if (problem.trim() === "") {
            alert("Silakan masukkan masalah Anda terlebih dahulu");
            return;
        }

        setIsLoading(true);
        try {
            const aiSolution = await getAISolution(problem);
            setSolution(aiSolution);
        } catch (error) {
            console.error("Gagal mendapatkan solusi:", error);
            alert("Terjadi kesalahan saat mendapatkan solusi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c' }} // Dark matrix-like background
            style={tw`flex-1`}
        >
            <SafeAreaView style={tw`flex-1`}>
                <ScrollView>
                    <BlurView intensity={20} tint="dark" style={tw`m-4 rounded-xl overflow-hidden`}>
                        <View style={tw`p-6 bg-black bg-opacity-70`}>
                            <View style={tw`items-center mb-6`}>
                                <Text style={tw`text-3xl font-bold text-green-500 font-mono`}>
                                    [ NIGGALEK ]
                                </Text>
                                <Text style={tw`text-green-400 mt-2 text-center italic font-mono`}>
                                    "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit"
                                </Text>
                            </View>


                            {/* Bagian AI Assistant */}
                            <View style={tw`bg-gray-900 bg-opacity-90 rounded-lg p-5 shadow-lg mb-5 border border-green-500`}>
                                <Text style={tw`text-green-500 text-lg font-medium mb-4 text-center font-mono`}>
                                    &gt;&gt; KING GEMINI &lt;&lt;
                                </Text>

                                <View style={tw`flex-row items-center mb-4`}>
                                    <View style={tw`w-10 h-10 bg-gray-800 rounded-md items-center justify-center mr-3 border border-green-500`}>
                                        <Text style={tw`text-green-500 text-xl`}>?</Text>
                                    </View>
                                    <TextInput
                                        style={tw`flex-1 h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                        placeholder="Masukkan masalah Anda..."
                                        placeholderTextColor="#4ADE80"
                                        value={problem}
                                        onChangeText={(text) => setProblem(text)}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={tw`bg-green-700 p-3 rounded-md mb-4 border border-green-500`}
                                    onPress={handleGetSolution}
                                    disabled={isLoading}
                                >
                                    <Text style={tw`text-green-300 text-center font-medium font-mono`}>
                                        {isLoading ? "BERPIKIR..." : "TANYA DONG KING..."}
                                    </Text>
                                </TouchableOpacity>

                                {isLoading && (
                                    <View style={tw`items-center my-2`}>
                                        <ActivityIndicator size="large" color="#4ADE80" />
                                    </View>
                                )}

                                {solution ? (
                                    <View style={tw`bg-gray-800 p-4 rounded-md border border-green-500`}>
                                        <Text style={tw`text-green-400 font-mono`}>
                                            {solution}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </BlurView>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Customer;