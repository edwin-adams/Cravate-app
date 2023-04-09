import React, { useState, useEffect } from 'react';
import { BackHandler, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';



export const VendorRegisterScreen = ({ navigation }) => {
    // Fields required for user registration model
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
    // Toggle confirm password visibility 
    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // Submit the details to register api
    const handleSignup = async () => {
        // Fields for validation
        let firstNameValid = true;
        let lastNameValid = true;
        let usernameValid = true;
        let passwordValid = true;
        let confirmPasswordValid = true;

        // If first name is empty, give error
        if (firstName.trim().length === 0) {
        firstNameValid = false;
        setFirstNameError('First Name is required');
        } else {
        setFirstNameError('');
        }

        // If last name is empty, give error
        if (lastName.trim().length === 0) {
        lastNameValid = false;
        setLastNameError('Last name is required');
        } else {
        setLastNameError('');
        }

        // If username is empty, give error
        if (username.trim().length === 0) {
        usernameValid = false;
        setUsernameError('Username is required');
        } else {
        setUsernameError('');
        }

        // If password is less than 6 characters, give error
        if (password.trim().length < 6) {
        passwordValid = false;
        setPasswordError('Password must be at least 6 characters long');
        } else {
        setPasswordError('');
        }

        // If confirm password is empty or isn't the same as password, give error
        if (confirmPassword.length < 6) {
        confirmPasswordValid = false;
        setConfirmPasswordError('Confirm password must be at least 6 characters long');
        } else if (password !== confirmPassword) {
        confirmPasswordValid = false;
        setConfirmPasswordError('Passwords do not match');
        } else {
        setConfirmPasswordError('');
        }

        // if validation satisfied call api
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
                // The signup was successful, navigate to the add food truck page
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
                <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("VendorLogin")}>Already an account? Login here</Button>
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
        marginVertical: 35,
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
});
