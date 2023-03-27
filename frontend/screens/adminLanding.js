import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";

export const AdminLanding = ({navigation}) => {
    return (
        <View style={styles.container}>
          <View style={styles.view}>
          <Card>
            <Card.Title title="Click on the roles to get all the records" titleStyle={styles.title}></Card.Title>
                <Card.Content>
                <Button mode="contained" style={styles.button} title="User" onPress={() => navigation.navigate("listUser")}>User</Button>
                <Button mode="contained" style={styles.button} title="Vendor" onPress={() => navigation.navigate("listVendor")} >Vendor</Button>
                <Button mode="contained" style={styles.button} title="Food Truck" onPress={() => navigation.navigate("listFoodTruck")} >Food Truck</Button>
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
