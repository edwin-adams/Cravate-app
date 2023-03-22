
import {StyleSheet, Text, View, Button} from 'react-native';

export default function HomeScreen({navigation}) {
    return (
        <View style = {styles.container}>
            <Text>Welcome to Cravate!</Text>
            <Button
                title = "For Vendors"
                onPress = {() => navigation.navigate("VendorLanding")}
            />
            <Button
                title = "For Customers"
                onPress = {() => navigation.navigate("CustomerLanding")}
            />    
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "t#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});