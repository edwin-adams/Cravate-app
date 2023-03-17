import React, {useState} from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form"


export const LoginScreen = ({navigation}) => {
    
    return (
        <SafeAreaView style={styles.container}>
            <View style = {styles.view}>
                <Card>
                    {/*<Avatar.Image size={24} source={require('..\assets\logo.png')} />*/ }
                    <Card.Title title = "Cravate" titleStyle= {styles.title}></Card.Title>
                    <Card.Content>
                        <TextInput label = "username" keyboardType="email-address"  left={<TextInput.Icon name="account" />} style={styles.textinput}></TextInput>
                        <TextInput label = "password" left={<TextInput.Icon name="form-textbox-password" />} right = {<TextInput.Icon name = "eye-off-outline"/>}  secureTextEntry={true} style={styles.textinput}></TextInput>
                        <Button mode="contained" style={styles.button} onPress={() => {Alert.alert("Login successful"); navigation.navigate("home")}}>Login</Button>
                        <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("register")}>Don't have an account? Sign Up here</Button>
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor: "rgb(101,37,131)"
    },
    textinput: {
      margin: 10,  
    },
    view: {
        width: "80%",
    },
    button: {
        marginVertical: 10,
    },
    title: {
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
  });