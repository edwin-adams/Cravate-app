import HomeScreen from "./screens/HomeScreen";
import VendorLanding from "./screens/VendorLanding";
import CustomerLanding from "./screens/CustomerLanding";
import { UserLoginScreen } from "./screens/authentication/userLoginPage";
import { UserRegisterScreen } from "./screens/authentication/userRegisterPage";
import { VendorLoginScreen } from "./screens/authentication/vendorLoginPage";
import { VendorRegisterScreen } from "./screens/authentication/vendorRegisterPage.";
import { SplashScreen } from "./screens/authentication/splashPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddFoodTruck } from "./screens/authentication/addFoodTruck";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      >

        <Stack.Screen 
          name="splash"
          component={SplashScreen}
          options = {{headerShown:false}}
        />

        <Stack.Screen 
          name="userLogin"
          component={UserLoginScreen}
          options = {{title: "User Login"}}
        />
        <Stack.Screen 
          name="userRegister"
          component={UserRegisterScreen}
          options = {{title: "User Registeration"}}
        />

        <Stack.Screen 
          name="vendorLogin"
          component={VendorLoginScreen}
          options = {{title: "Vendor login"}}
        />
        <Stack.Screen 
          name="vendorRegister"
          component={VendorRegisterScreen}
          options = {{title: "Vendor Register"}}
        />
        <Stack.Screen 
          name="addFoodTruck"
          component={AddFoodTruck}
          options = {{title: "Add Food Truck Details",headerShown: false}}
        />
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options ={{title: "HomeScreen Landing"}}
        />
        <Stack.Screen
          name="VendorLanding"
          component={VendorLanding}
          options ={{title: "Vendor Landing"}}
        />
        <Stack.Screen
          name="CustomerLanding"
          component={CustomerLanding}
          options ={{title: "Customer Landing"}}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
};
