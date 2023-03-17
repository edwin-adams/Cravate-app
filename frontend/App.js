import HomeScreen from "./screens/HomeScreen";
import VendorLanding from "./screens/VendorLanding";
import CustomerLanding from "./screens/CustomerLanding";
import { LoginScreen } from "./screens/authentication/loginPage";
import { RegisterScreen } from "./screens/authentication/registerPage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { validateFoodTruck } from "./screens/authentication/validateFoodTruck";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="login"
          component={LoginScreen}
          options = {{}}
        />
        <Stack.Screen 
          name="register"
          component={RegisterScreen}
          options = {{}}
        />
        <Stack.Screen 
          name = "ValidateFoodTruck"
          component={validateFoodTruck}
          options = {{}}
        />
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options ={{title: "Welcome"}}
        />
        <Stack.Screen
          name="VendorLanding"
          component={VendorLanding}
          options ={{title: "Vendor Authentication"}}
        />
        <Stack.Screen
          name="CustomerLanding"
          component={CustomerLanding}
          options ={{title: "Customer Authentication"}}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
};
