import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Button, Card } from "react-native-paper";

export const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
          <View style={styles.view}>
          <Card>
            <Card.Title title="Welcome to Cravate choose your path" titleStyle={styles.title}></Card.Title>
                <Card.Content>
                <Button mode="contained" style={styles.button} title="User" onPress={() => navigation.navigate("userLogin")}>User</Button>
                <Button mode="contained" style={styles.button} title="Vendor" onPress={() => navigation.navigate("vendorLogin")} >Vendor</Button>
                <Button mode="contained" style={styles.button} title="Admin" onPress={() => navigation.navigate("adminLogin")} >Admin</Button>
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
