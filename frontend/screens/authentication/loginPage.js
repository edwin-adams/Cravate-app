import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Button, Card, TextInput } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import axios from 'axios';


export const LoginScreen = ({ navigation }) => {

    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        await fetch('http://3.239.61.7:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async response => {
            console.log(JSON.stringify(await response.text()))
            console.log("-------------------------------------------");
            // console.log(responseData);
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.view}>
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

                        {/* <TextInput label = "username" keyboardType="email-address"  left={<TextInput.Icon name="account" />} style={styles.textinput}></TextInput>
                        <TextInput label = "password" left={<TextInput.Icon name="form-textbox-password" />} right = {<TextInput.Icon name = "eye-off-outline"/>}  secureTextEntry={true} style={styles.textinput}></TextInput> */}
                        <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit)}>Login</Button>
                        <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("register")}>Don't have an account? Sign Up here</Button>
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