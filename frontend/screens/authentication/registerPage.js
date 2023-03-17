import React, { useState } from "react";
import { Button, Card, TextInput } from "react-native-paper";
import { ScrollView,SafeAreaView, StyleSheet, View, Text } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form"

export const RegisterScreen = ({navigation}) => {
   
    const [showPassword, setShowPassword] = useState(false);
    const { control, handleSubmit, formState: { errors }, watch } = useForm();
    const onSubmit = (data) => {
        console.log(data);
    }
    
    return (
        <SafeAreaView>
            <ScrollView>
                <Card>
                <Card.Title title = "Register" titleStyle= {styles.title}></Card.Title>
                </Card>

                <Controller
                    control={control}
                    rules={{
                    required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="First Name"
                        onBlur={onBlur}
                        style={styles.textinput}
                        onChangeText={onChange}
                        value={value}
                        error={!!errors.firstName}
                    />
                    )}
                    name="firstName"
                    defaultValue=""
                    />

                {errors.firstName && (
                    <Text>First Name cannot be empty</Text>
                )}

                <Controller
                    control={control}
                    rules={{
                    required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Last Name"
                        onBlur={onBlur}
                        style={styles.textinput}
                        onChangeText={onChange}
                        value={value}
                        error={!!errors.lastName}
                    />
                    )}
                    name="lastName"
                    defaultValue=""
                    />

                {errors.lastName && (
                    <Text>Last Name cannot be empty</Text>
                )}

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
                    render={({ onChange, onBlur, value }) => (
                    <TextInput
                        label="Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        style={styles.textinput}
                        value={value}
                        error={!!errors.password}
                        secureTextEntry={!showPassword}
                        right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                    />
                    )}
                    name="password"
                    rules={{
                    required: true,
                    minLength: 6,
                    }}
                    defaultValue=""
                />
                {errors.password && <Text>Password cannot be empty</Text>}

                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                    <TextInput
                        label="Confirm Password"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        style={styles.textinput}
                        value={value}
                        error={!!errors.password}
                        secureTextEntry={!showPassword}
                        right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />}
                    />
                    )}
                    name="confirmPassword"
                    rules={{
                    required: true,
                    minLength: 6,
                    validate: value => value === watch('password') || 'Passwords do not match',
                    }}
                    defaultValue=""
                />
                {errors.confirmPassword && (
                    <Text>{errors.confirmPassword.message || 'This field is required'}</Text>
                )}

                {/* <TextInput label = "First name" style = {styles.textinput} />
                <TextInput label = "Last name" style = {styles.textinput}/>
                <TextInput label = "Username" style = {styles.textinput}/>
                <TextInput label = "Password" right={<TextInput.Icon name="eye" />} style = {styles.textinput}/>
                <TextInput label = "Confirm Password" secureTextEntry={true} style = {styles.textinput}/> */}
                <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit)}>Register</Button>
                <Button uppercase={false} style={styles.button} onPress={() => navigation.navigate("login")}>Have an account? Login here</Button>
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
        marginVertical:50,
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
  });