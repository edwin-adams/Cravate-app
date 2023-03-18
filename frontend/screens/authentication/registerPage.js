import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button, Text,Card, Checkbox, Switch } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';

export const RegisterScreen = ({ navigation }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => {
    // handle submit logic based on switch value
    console.log(data);
    // if (toggleSwitch) {
    //   navigation.navigate('AnotherPage');
    // } else {
    //   navigation.navigate('HomePage');
    // }
  }

  return (
      <SafeAreaView>
        <ScrollView>
            <Card>
                <Card.Title title = "Register" titleStyle= {styles.title}></Card.Title>
            </Card>
            
            <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    label="First Name"
                    mode="outlined"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.firstName && <Text>This field is required</Text>}
                />
                )}
            />
            <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    label="Last Name"
                    mode="outlined"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.lastName && <Text>This field is required</Text>}
                />
                )}
            />
            <Controller
                name="username"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    label="Username"
                    mode="outlined"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.username && <Text>This field is required</Text>}
                />
                )}
            />
            <Controller
                name="password"
                control={control}
                rules={{ required: true, minLength: 6 }}
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry={passwordVisibility}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password && <Text>This field is required and must be at least 6 characters</Text>}
                    right={
                    <TextInput.Icon
                        name={passwordVisibility ? 'eye-off' : 'eye'}
                        onPress={() => setPasswordVisibility(!passwordVisibility)}
                    />
                    }
                />
                )}
            />
            <Controller
                name="confirmPassword"
                control={control}
                rules={{
                required: true,
                validate: (value) => value === control.getValues('password')
                }}
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    label="Confirm Password"
                    mode="outlined"
                    secureTextEntry={confirmPasswordVisibility}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.confirmPassword && <Text>This field is required and must match Password field</Text>}
                    right={ <TextInput.Icon
                    name={confirmPasswordVisibility ? 'eye-off' : 'eye'}
                    onPress={() => setConfirmPasswordVisibility(!confirmPasswordVisibility)}
                />
                }
                />
                )}
            />
            <View style={styles.switchContainer}>
                <Text>Toggle Switch: </Text>
                <Switch value={toggleSwitch} onValueChange={setToggleSwitch} />
            </View>
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                Submit
            </Button>
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
        marginVertical:20,
        color: "rgb(101,37,131)",
        fontSize: 20,
        textAlign: "center",
    },
  });
    