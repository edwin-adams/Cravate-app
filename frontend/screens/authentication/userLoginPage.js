import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text,  BackHandler } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";


export const UserLoginScreen = ({ navigation }) => {

    // Fields required for user login model
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm();

    
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
    
    // Submit the details to login api
    const onSubmit = async (data) => {
        console.log('data is:', data);

        const dataValue = data.username;
        console.log(' data value is: ', dataValue);

        await fetch('http://3.239.61.7:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async response => {
           
            let message = await response.text();
            if (message === 'Successfully logged in.') navigation.navigate("CustomerMap", dataValue);
             else Alert.alert('Authentication failed')
            
           
            console.log(message);
            console.log("-------------------------------------------");
        });
    };

    // Displays on the screen
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
                {/* To display in the middle of screen  */}
                <Card>
                    <Card.Title title="Cravate" titleStyle={styles.title}></Card.Title>
                    <Card.Content>

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Username"
                                    onBlur={onBlur}
                                    style={styles.textinput}
                                    onChangeText={onChange}
                                    value={value}
                                    error={!!errors.username}
                                />
                            )}
                            name="username"
                            defaultValue=""
                        />

                        {errors.username && (
                            <Text>Username cannot be empty</Text>
                        )}

                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                minLength: 6,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    style={styles.textinput}
                                    value={value}
                                    error={!!errors.password}
                                    secureTextEntry={!showPassword}
                                    right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                                />
                            )}
                            name="password"
                            defaultValue=""
                        />

                        {errors.password && errors.password.type === 'minLength' && (
                            <Text>Password must be at least 6 characters long</Text>
                        )}
                        
                        <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit)}>Login</Button>
                        <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("userRegister")}>Don't have an account? Sign Up here</Button>
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