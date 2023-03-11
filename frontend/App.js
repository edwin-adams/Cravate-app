import HomeScreen from "./screens/HomeScreen";
import VendorLanding from "./screens/VendorLanding";
import CustomerLanding from "./screens/CustomerLanding";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
