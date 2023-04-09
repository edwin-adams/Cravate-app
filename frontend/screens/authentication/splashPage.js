import React from "react";
import {  StyleSheet, View} from "react-native";
import { Button, Card } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SplashScreen = ({ navigation }) => {
    
    // Set selected role to user 
    const setRoleUser = async () =>{
        try {
            await AsyncStorage.setItem('selectedRole', 'user');
            console.log('Value saved successfully.');
            navigation.navigate("UserLogin");
          } catch (error) {
            console.log('Error saving value: ', error);
          }
    }
    
    // Set selected role to vendor
    const setRoleVendor = async () =>{
        try {
            await AsyncStorage.setItem('selectedRole', 'vendor');
            console.log('Value saved successfully.');
            navigation.navigate("VendorLogin");
          } catch (error) {
            console.log('Error saving value: ', error);
          }
    }

    // Set selected role to admin
    const setRoleAdmin = async () =>{
        try {
            await AsyncStorage.setItem('selectedRole', 'admin');
            console.log('Value saved successfully.');
            navigation.navigate("AdminLogin");
          } catch (error) {
            console.log('Error saving value: ', error);
          }
    }

    // Displayed on screen
    return (
        <View style={styles.container}>
          <View style={styles.view}>
          <Card>
            <Card.Title title="Welcome to Cravate choose your path" titleStyle={styles.title}></Card.Title>
                <Card.Content>
                <Button mode="contained" style={styles.button} title="User" onPress={setRoleUser}>User</Button>
                <Button mode="contained" style={styles.button} title="Vendor" onPress={setRoleVendor} >Vendor</Button>
                <Button mode="contained" style={styles.button} title="Admin" onPress={setRoleAdmin} >Admin</Button>
                </Card.Content>
            </Card>
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    title: {
        color: "rgb(101,37,131)",
        fontSize: 17,
        textAlign: "center",
    },
    view: {
        width: "80%",
    },
    button: {
        marginVertical: 10,
    },
  });
