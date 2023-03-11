
import {StyleSheet, Text, View, Button} from 'react-native';

export default function VendorLanding() {
    return (
        <View style = {styles.container}>
            <Text>Vendor Login & Signup</Text>

            {/*<Button
                title = "For Vendors"
                onPress = {() => navigation.navigate("VendorLanding")}
            />
            <Button
                title = "For Customers"
                onPress = {() => navigation.navigate("ConsumerLanding")}
            /> */}   
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