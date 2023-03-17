import React, {useState} from "react";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";

export const validateFoodTruck = ({navigation}) => {
    return(
        <SafeAreaView style={styles.container}>
            <View style = {styles.view}>
                <Card>
                    <Card.Title title = "Enter your permit number" titleStyle= {styles.title}></Card.Title>
                    <Card.Content>
                        <TextInput label = "permit number" style={styles.textinput}></TextInput>            
                        <Button mode="contained" style={styles.button} onPress={() => {Alert.alert("Registration successful. Sign in now"); navigation.navigate("login")}}>Submit</Button>
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