import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, IconButton, } from 'react-native-paper';



export const VendorRegisterScreen = ({ navigation }) => {
    const [contactPersonName, setContactPersonName] = useState('');
    const [foodTruckName, setFoodTruckName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [permitNumber,setPermitNumber] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [contactPersonNameError, setContactPersonNameError] = useState('');
    const [foodTruckNameError, setFoodTruckNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [permitNumberError,setPermitNumberError] = useState('');

    const handlePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleVerify = () =>{
        
    }
    
    const handleSignup = async () => {
        let contactPersonNameValid = true;
        let foodTruckNameValid = true;
        let usernameValid = true;
        let passwordValid = true;
        let confirmPasswordValid = true;
        let permitNumberValid = true;

        if (contactPersonName.length === 0) {
        contactPersonNameValid = false;
        setContactPersonNameError('Contact Person\'s Name is required');
        } else {
        setContactPersonNameError('');
        }

        if (foodTruckName.length === 0) {
        foodTruckNameValid = false;
        setFoodTruckNameError('Food Truck Name is required');
        } else {
        setFoodTruckNameError('');
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

        if (permitNumber.length < 6){
            permitNumberValid = false;
            setPermitNumberError('Permit number must be atleast 6 characters long');
        }else {
            setPermitNumberError('');
        }

        if (contactPersonNameValid && foodTruckNameValid && usernameValid && passwordValid && confirmPasswordValid && permitNumberValid) {
        const data = {
            contact_person: contactPersonName,
            food_truck: foodTruckName,
            username: username,
            password: password,
            permit_numer: permitNumber
        };
        console.log(data);
        await fetch('http://3.239.61.7:3000/vendor/signUp', {
                method: 'POST',
                body: JSON.stringify(data),headers: {
                        'Content-Type': 'application/json' } })
                        .then(res => console.log(JSON.stringify(res))) .catch(err => console.log('err =>', JSON.stringify(err)))
            console.log(data)
            console.log('Successful');
        }
    };


    return (
        <SafeAreaView>
            <ScrollView>
                <Card>
                    <Card.Title title="Vendor Registration" titleStyle={styles.title}></Card.Title>
                </Card>

                <TextInput
                    label="Contact Person name"
                    value={contactPersonName}
                    onChangeText={setContactPersonName}
                    error={!!contactPersonNameError}
                    errorText={contactPersonNameError}
                    style={styles.textinput}
                />
                {contactPersonNameError ? <Text style={styles.error}>{contactNameError}</Text> : null}
                <TextInput
                    label="Food Truck Name"
                    value={foodTruckName}
                    onChangeText={setFoodTruckName}
                    error={!!foodTruckNameError}
                    errorText={foodTruckNameError}
                    style={styles.textinput}
                />
                 {foodTruckNameError ? <Text style={styles.error}>{foodTruckNameError}</Text> : null}
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

                <View style={{flexDirection:"row",flex:1}}>
                    <TextInput
                        label="Food Truck Permit Number"
                        value={permitNumber}
                        onChangeText={setPermitNumber}
                        error={!!permitNumberError}
                        errorText={permitNumberError}
                        style={styles.textinput}
                    />
                    <Button mode="contained" style={styles.button} onPress={handleVerify}>Verify</Button>
                </View>
                {permitNumberError ? <Text style={styles.error}>{permitNumberError}</Text> : null}

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
