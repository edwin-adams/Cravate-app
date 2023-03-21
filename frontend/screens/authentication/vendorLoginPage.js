import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";


export const VendorLoginScreen = ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async () => {
        let usernameValid = true;
        let passwordValid = true;

        if (username.length === 0) {
            usernameValid = false;
            setUsernameError('Username is required');
            } else {
            setUsernameError('');
            }
    
            if (password.length < 6) {
            passwordValid = false;
            setPasswordError('Password must be at least 6 characters long');
            } else {
            setPasswordError('');
            }

            if (firstNameValid && lastNameValid && usernameValid && passwordValid && confirmPasswordValid) {
                const data = {
                    username: username,
                    password: password
                };
                console.log(data);
                // Redirect based on toggle value
                await fetch('http://3.239.61.7:3000/vendor/login', {
                        method: 'POST',
                        body: JSON.stringify(data),headers: {
                                'Content-Type': 'application/json' } })
                                .then(res => console.log(JSON.stringify(res))) .catch(err => console.log('err =>', JSON.stringify(err)))
                console.log(data)
                navigation.navigate("VendorLanding");
            }
    };    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                <Card>
                    <Card.Title title="Cravate Vendor Login" titleStyle={styles.title}></Card.Title>
                    <Card.Content>

                        <TextInput
                            label="Username"
                            value={username}
                            onChangeText={setUsername}
                            error={!!usernameError}
                            errorText={usernameError}
                            style={styles.textinput}
                        />
                        {usernameError ? <Text style={styles.error}>{usernameError}</Text> : null}
                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!passwordVisible}
                            error={!!passwordError}
                            errorText={passwordError}
                            style={styles.textinput}
                            right={
                            <TextInput.Icon
                                icon={passwordVisible ? 'eye-off' : 'eye'}
                                onPress={handlePasswordVisibility}
                            />
                            }
                        />
                        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

                        <Button mode="contained" style={styles.button} onPress={handleLogin}>Login</Button>
                        <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("vendorRegister")}>Don't have an account? Sign Up here</Button>
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