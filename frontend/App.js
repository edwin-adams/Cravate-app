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


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
          name="splash"
          component={SplashScreen}
          options = {{}}
        />

        <Stack.Screen 
          name="userLogin"
          component={UserLoginScreen}
          options = {{}}
        />
        <Stack.Screen 
          name="userRegister"
          component={UserRegisterScreen}
          options = {{}}
        />

        <Stack.Screen 
          name="vendorLogin"
          component={VendorLoginScreen}
          options = {{}}
        />
        <Stack.Screen 
          name="vendorRegister"
          component={VendorRegisterScreen}
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
