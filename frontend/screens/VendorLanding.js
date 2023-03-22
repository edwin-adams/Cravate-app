import { StatusBar } from 'expo-status-bar';
import { useState , component} from 'react';
import {KeyboardAvoidingView, ScrollView,StyleSheet, Text, TouchableOpacity, View,TextInput,Button,FlatList,SafeAreaView  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import store from '../store';
import { Provider } from 'react-redux';

export default function VendorLanding({navigation}) {
    return (
        <View style={styles.container}>
  
            <Text style={styles.box}>Start Sharing location</Text>
            <Text style={styles.sectionTitle}>Add items</Text>
            <Provider store={store}>
               <HomeScreen/>
            </Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "t#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});