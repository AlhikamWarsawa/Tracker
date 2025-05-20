import React, { useEffect, useState } from "react";
import { Picker, Text, TextInput, TouchableOpacity, View, ImageBackground, ActivityIndicator, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import tw from "twrnc";
import { GoogleGenAI } from "@google/genai";


const Index = () => {
    const [form, setForm] = useState({
        name: "",
        category: "wajib",
        date: "",
    });

    const [ibadah, setIbadah] = useState([]);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        id: null,
        name: "",
        category: "",
        date: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleEditChange = (field: string, value: string) => {
        setEditForm({ ...editForm, [field]: value });
    };

    const getIbadah = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/niggalek");
            const data = await response.json();
            setIbadah(data);
        } catch (error) {
            console.error("Eror gabisa menampilkan data:", error);
        }
    };

    const handleSubmit = async () => {
        if (
            form.name.trim() === "" ||
            form.category.trim() === "" ||
            form.date.trim() === ""
        ) {
            alert("Semua field harus diisi");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/niggalek", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Data berhasil ditambahkan");
                setForm({
                    name: "",
                    category: "wajib",
                    date: "",
                });
                getIbadah();
            } else {
                alert("Gagal menambahkan data" + data.message);
            }
        } catch (error) {
            console.error("Error adding data:", error);
            alert("Terjadi kesalahan saat menambahkan data");
        }
    };

    const handleEditSubmit = async () => {
        if (
            editForm.name.trim() === "" ||
            editForm.category.trim() === "" ||
            editForm.date.trim() === ""
        ) {
            alert("Semua field harus diisi");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/niggalek/${editForm.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editForm.name,
                    category: editForm.category,
                    date: editForm.date
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Data berhasil diperbarui");
                setModalVisible(false);
                setEditMode(false);
                getIbadah();
            } else {
                alert("Gagal memperbarui data: " + data.message);
            }
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Terjadi kesalahan saat memperbarui data");
        }
    };

    const handleEdit = (item: any) => {
        setEditForm({
            id: item.id,
            name: item.name,
            category: item.category,
            date: item.date,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/niggalek/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert("Data berhasil dihapus");
                getIbadah();
            } else {
                alert("Gagal menghapus data: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Terjadi kesalahan saat menghapus data");
        }
    };

    const getAISolution = async (problemText: string) => {
        try {
            const ai = new GoogleGenAI({ apiKey: "AIzaSyBvLyOKr9gVWte2ATyOGzYCvFhCpO9WCmU" });

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: `Berikan solusi untuk masalah ibadah berikut, secara singkat: ${problemText}`,
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

    useEffect(() => {
        getIbadah();
    }, []);

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

                            <View style={tw`bg-gray-900 bg-opacity-90 rounded-lg p-5 shadow-lg mb-5 border border-green-500`}>
                                <Text style={tw`text-green-500 text-lg font-medium mb-4 text-center font-mono`}>
                                    &gt;&gt; CATAT AMAL IBADAHMU &lt;&lt;
                                </Text>

                                <View style={tw`flex-row items-center mb-4`}>
                                    <View style={tw`w-10 h-10 bg-gray-800 rounded-md items-center justify-center mr-3 border border-green-500`}>
                                        <Text style={tw`text-green-500 text-xl`}>$</Text>
                                    </View>
                                    <TextInput
                                        style={tw`flex-1 h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                        placeholder="Nama Ibadah"
                                        placeholderTextColor="#4ADE80"
                                        value={form.name}
                                        onChangeText={(text) => handleChange("name", text)}
                                    />
                                </View>

                                <View style={tw`flex-row items-center mb-4`}>
                                    <View style={tw`w-10 h-10 bg-gray-800 rounded-md items-center justify-center mr-3 border border-green-500`}>
                                        <Text style={tw`text-green-500 text-xl`}>@</Text>
                                    </View>
                                    <View
                                        style={tw`flex-1 h-[50px] border border-green-500 rounded-md px-1 bg-gray-800 justify-center`}
                                    >
                                        <View style={tw`bg-transparent`}>
                                            <Picker
                                                selectedValue={form.category}
                                                onValueChange={(value) => handleChange("category", value)}
                                                style={tw`bg-transparent text-green-400 h-[50px] border-none`}
                                                dropdownIconColor="#4ADE80"
                                            >
                                                <Picker.Item label="Wajib" value="wajib" />
                                                <Picker.Item label="Sunnah" value="sunnah" />
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <View style={tw`flex-row items-center mb-6`}>
                                    <View style={tw`w-10 h-10 bg-gray-800 rounded-md items-center justify-center mr-3 border border-green-500`}>
                                        <Text style={tw`text-green-500 text-xl`}>#</Text>
                                    </View>
                                    <TextInput
                                        style={tw`flex-1 h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                        placeholder="Tanggal (YYYY-MM-DD)"
                                        placeholderTextColor="#4ADE80"
                                        value={form.date}
                                        onChangeText={(text) => handleChange("date", text)}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={tw`bg-green-700 p-3 rounded-md mb-2 border border-green-500`}
                                    onPress={handleSubmit}
                                >
                                    <Text style={tw`text-green-300 text-center font-medium font-mono`}>
                                        SIMPAN
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bagian AI Assistant */}
                            <View style={tw`bg-gray-900 bg-opacity-90 rounded-lg p-5 shadow-lg mb-5 border border-green-500`}>
                                <Text style={tw`text-green-500 text-lg font-medium mb-4 text-center font-mono`}>
                                    &gt;&gt; GUS GEMINI &lt;&lt;
                                </Text>

                                <View style={tw`flex-row items-center mb-4`}>
                                    <View style={tw`w-10 h-10 bg-gray-800 rounded-md items-center justify-center mr-3 border border-green-500`}>
                                        <Text style={tw`text-green-500 text-xl`}>?</Text>
                                    </View>
                                    <TextInput
                                        style={tw`flex-1 h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                        placeholder="Masukkan masalah ibadah Anda..."
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
                                        {isLoading ? "BERPIKIR..." : "TANYA DONG GUS..."}
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

                            {/* Tampilan data ibadah */}
                            {ibadah.length > 0 ? (
                                <View style={tw`bg-gray-900 bg-opacity-90 rounded-lg p-5 shadow-lg border border-green-500`}>
                                    <Text style={tw`text-green-500 text-lg font-medium mb-4 text-center font-mono`}>
                                        &gt;&gt; RIWAYAT IBADAH &lt;&lt;
                                    </Text>
                                    {ibadah.map((item: any, index: number) => (
                                        <View key={index} style={tw`bg-gray-800 p-3 rounded-md mb-3 border border-green-500`}>
                                            <Text style={tw`text-green-400 font-mono mb-1`}>
                                                Nama: {item.name}
                                            </Text>
                                            <Text style={tw`text-green-400 font-mono mb-1`}>
                                                Kategori: {item.category}
                                            </Text>
                                            <Text style={tw`text-green-400 font-mono mb-3`}>
                                                Tanggal: {item.date}
                                            </Text>
                                            <View style={tw`flex-row justify-end`}>
                                                <TouchableOpacity
                                                    style={tw`bg-green-600 py-2 px-3 rounded-md border border-green-500`}
                                                    onPress={() => handleEdit(item)}
                                                >
                                                    <Text style={tw`text-white font-bold`}>
                                                        EDIT
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(item.id)}
                                                    style={tw`bg-red-600 py-2 px-3 rounded-md border border-red-500 ml-2`}
                                                >
                                                    <Text style={tw`text-white font-bold`}>DELETE</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={tw`bg-gray-900 bg-opacity-90 rounded-lg p-5 shadow-lg border border-green-500`}>
                                    <Text style={tw`text-green-500 text-center font-mono`}>
                                        Belum ada data ibadah
                                    </Text>
                                </View>
                            )}
                        </View>
                    </BlurView>
                </ScrollView>
            </SafeAreaView>

            {/* Modal Edit */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-80`}>
                    <View style={tw`bg-gray-900 p-6 rounded-xl border-2 border-green-500 w-11/12 max-w-md`}>
                        <Text style={tw`text-green-500 text-xl font-bold mb-4 text-center font-mono`}>
                            EDIT IBADAH
                        </Text>

                        <View style={tw`mb-4`}>
                            <Text style={tw`text-green-400 mb-1 font-mono`}>Nama Ibadah:</Text>
                            <TextInput
                                style={tw`h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                value={editForm.name}
                                onChangeText={(text) => handleEditChange("name", text)}
                                placeholderTextColor="#4ADE80"
                            />
                        </View>

                        <View style={tw`mb-4 bg-transparent`}>
                            <Text style={tw`text-green-400 mb-1 font-mono`}>Kategori:</Text>
                            <View style={tw`border border-green-500 rounded-md bg-gray-800`}>
                                <Picker
                                    selectedValue={editForm.category}
                                    onValueChange={(value) => handleEditChange("category", value)}
                                    style={tw`text-green-400 h-[50px] bg-transparent`}
                                    dropdownIconColor="#4ADE80"
                                >
                                    <Picker.Item label="Wajib" value="wajib" />
                                    <Picker.Item label="Sunnah" value="sunnah" />
                                </Picker>
                            </View>
                        </View>

                        <View style={tw`mb-6`}>
                            <Text style={tw`text-green-400 mb-1 font-mono`}>Tanggal:</Text>
                            <TextInput
                                style={tw`h-[50px] border border-green-500 rounded-md px-4 text-base bg-gray-800 text-green-400 font-mono`}
                                value={editForm.date}
                                onChangeText={(text) => handleEditChange("date", text)}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#4ADE80"
                            />
                        </View>

                        <View style={tw`flex-row justify-between`}>
                            <TouchableOpacity
                                style={tw`bg-red-700 py-3 px-4 rounded-md border border-red-500 flex-1 mr-2`}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={tw`text-red-200 text-center font-medium font-mono`}>
                                    BATAL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={tw`bg-green-700 py-3 px-4 rounded-md border border-green-500 flex-1 ml-2`}
                                onPress={handleEditSubmit}
                            >
                                <Text style={tw`text-green-300 text-center font-medium font-mono`}>
                                    SIMPAN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

export default Index;