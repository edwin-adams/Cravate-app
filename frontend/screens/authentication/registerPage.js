import React from "react";
import { Button, Card, TextInput } from "react-native-paper";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";
import { Title } from "react-native-paper";

export const RegisterScreen = ({navigation}) => {
   
    return (
        <SafeAreaView>
            <ScrollView>
                <Card>
                <Card.Title title = "Register" titleStyle= {styles.title}></Card.Title>
                </Card>
                <TextInput label = "First name" style = {styles.textinput} />
                <TextInput label = "Last name" style = {styles.textinput}/>
                <TextInput label = "Username" style = {styles.textinput}/>
                <TextInput label = "Password" right={<TextInput.Icon name="eye" />} style = {styles.textinput}/>
                <TextInput label = "Confirm Password" secureTextEntry={true} style = {styles.textinput}/>
                <Button mode="contained" style={styles.button}>Register</Button>
                <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("login")}>Have an account? Login here</Button>
            </ScrollView>
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
        marginVertical:50,
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
  });