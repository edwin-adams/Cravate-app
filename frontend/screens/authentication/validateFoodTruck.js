import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Card, TextInput } from "react-native-paper";

export const ValidateFoodTruck = ({ navigation }) => {
    const [permit, setPermit] = useState('');
    const [permitError, setPermitError] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                <Card>
                    <Card.Title title="Verify your Food Truck " titleStyle={styles.title}></Card.Title>
                    <Card.Content>
                        <TextInput
                            label="Food Truck Permit Number"
                            value={permit}
                            onChangeText={setPermit}
                            error={!!permitError}
                            errorText={permitError}
                            style={styles.textinput}
                        />
                    {firstNameError ? <Text style={styles.error}>{firstNameError}</Text> : null}
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