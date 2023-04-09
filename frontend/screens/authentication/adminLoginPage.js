import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, BackHandler } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";


export const AdminLoginScreen = ({ navigation }) => {

    // Fields required for admin login model
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    
    // Constructor function kind of
    useEffect(() => {
        // If backbutton is pressed it has no effect
        const backAction = () => {
          return true; // returning true disables the back button
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      }, []);
    
    
    // Toggle password visibility  
    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Submit the details to login api
    const handleLogin = async () => {
        // Fields for validation
        let usernameValid = true;
        let passwordValid = true;

        // If username is empty, give error
        if (username.trim().length === 0) {
            usernameValid = false;
            setUsernameError('Username is required');
            } else {
            setUsernameError('');
            }
    
            // if password is less than 6 characters, give error
            if (password.trim().length < 6) {
            passwordValid = false;
            setPasswordError('Password must be at least 6 characters long');
            } else {
            setPasswordError('');
            }

            // if validation satisfied call api
            if (usernameValid && passwordValid) {
                const data = {
                    username: username,
                    password: password
                };
                console.log(data);
                await fetch('http://3.239.61.7:3000/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }).then(async response => {
                    
                    let message = await response.text();
                    if (message === 'Successfully logged in.') navigation.navigate("adminLanding")
                    else Alert.alert('Authentication failed')                 
                    console.log(message);
                    console.log("-------------------------------------------");
                    
                });
            }
    };    

    // Displays on the screen
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                {/* To display in the middle of screen  */}
                <Card>
                    <Card.Title title="Cravate Admin Login" titleStyle={styles.title}></Card.Title>
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
                            defaultValue="hempt20"
                            right={
                            <TextInput.Icon
                                icon={passwordVisible ? 'eye-off' : 'eye'}
                                onPress={handlePasswordVisibility}
                            />
                            }
                        />
                        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

                        <Button mode="contained" style={styles.button} onPress={handleLogin}>Login</Button>
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