import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, IconButton, } from 'react-native-paper';



export const VendorRegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    
    const handleSignup = async () => {
        let firstNameValid = true;
        let lastNameValid = true;
        let usernameValid = true;
        let passwordValid = true;
        let confirmPasswordValid = true;

        if (firstName.length === 0) {
        firstNameValid = false;
        setFirstNameError('First Name is required');
        } else {
        setFirstNameError('');
        }

        if (lastName.length === 0) {
        lastNameValid = false;
        setLastNameError('Last name is required');
        } else {
        setLastNameError('');
        }

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

        if (confirmPassword.length < 6) {
        confirmPasswordValid = false;
        setConfirmPasswordError('Confirm password must be at least 6 characters long');
        } else if (password !== confirmPassword) {
        confirmPasswordValid = false;
        setConfirmPasswordError('Passwords do not match');
        } else {
        setConfirmPasswordError('');
        }


        if (firstNameValid && lastNameValid && usernameValid && passwordValid && confirmPasswordValid) {
            const data = {
                first_name: firstName,
                last_name: lastName,
                username: username,
                password: password
            };
            console.log(data);
            try {
                const response = await fetch('http://3.239.61.7:3000/vendor/signUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
            
                if (response.ok) {
                // The signup was successful, navigate to the next screen
                    navigation.navigate('addFoodTruck',{
                        username 
                    });
                } else {
                const errorText = await response.text();
                console.error(errorText);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <SafeAreaView>
            <ScrollView>
                <Card>
                    <Card.Title title="Vendor Registration" titleStyle={styles.title}></Card.Title>
                </Card>

                <TextInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={!!firstNameError}
                    errorText={firstNameError}
                    style={styles.textinput}
                />
                {firstNameError ? <Text style={styles.error}>{firstNameError}</Text> : null}
                <TextInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    error={!!lastNameError}
                    errorText={lastNameError}
                    style={styles.textinput}
                />
                 {lastNameError ? <Text style={styles.error}>{lastNameError}</Text> : null}
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
                <TextInput
                    label="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPasswordVisible}
                    error={!!confirmPasswordError}
                    errorText={confirmPasswordError}
                    style={styles.textinput}
                    right={
                    <TextInput.Icon
                        icon={confirmPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={handleConfirmPasswordVisibility}
                    />
                    }
                />
                {confirmPasswordError ? <Text style={styles.error}>{confirmPasswordError}</Text> : null}


                <Button mode="contained" style={styles.button} onPress={handleSignup}>Sign up</Button>
                <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("vendorLogin")}>Already an account? Login here</Button>
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
    error: {
        color: 'red',
        marginBottom: 8,
        marginLeft:10,
      },
    textinput: {
        flex:1,
        margin: 10,  
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16
    },
    toggleText: {
        fontSize: 16,
    },
    view: {
        width: "80%",
    },
    button: {
        marginVertical: 10,
    },
    title: {
        marginVertical: 20,
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
});
