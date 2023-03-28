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
import { AdminLoginScreen } from "./screens/authentication/adminLoginPage";
import { AdminLanding } from "./screens/adminLanding";
import { ListVendor } from "./screens/listVendor";
import { ListUser } from "./screens/listUser";
import { ListFoodTruck } from "./screens/listFoodTruck";
import { UserDetails } from "./screens/userDetails";
import { FoodTruckDetails } from "./screens/foodTruckDetails";
import { VendorDetails } from "./screens/vendorDetails";
import CustomerMapScreen from "./screens/maps/CustomerMap.js"
import { createSwitchNavigator } from '@react-navigation/core';

const Stack = createNativeStackNavigator();
// const CustomerSwitch = createSwitchNavigator({
//   CustomerLanding: CustomerLandingScreen,
//   CustomerMap: CustomerMapScreen,
// });

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
          name="adminLogin"
          component={AdminLoginScreen}
          options = {{headerShown:false}}
        />

        <Stack.Screen 
          name="adminLanding"
          component={AdminLanding}
          options = {{headerShown:false}}
        />

        <Stack.Screen 
          name="listVendor"
          component={ListVendor}
          options = {{}}
        />

        <Stack.Screen 
          name="listUser"
          component={ListUser}
          options = {{}}
        />

        <Stack.Screen 
          name="listFoodTruck"
          component={ListFoodTruck}
          options = {{}}
        />

        <Stack.Screen 
          name="userDetails"
          component={UserDetails}
          options = {{}}
        />

        <Stack.Screen 
          name="foodTruckDetails"
          component={FoodTruckDetails}
          options = {{}}
        />

        <Stack.Screen 
          name="vendorDetails"
          component={VendorDetails}
          options = {{}}
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

        <Stack.Screen
          name="CustomerMap"
          component={CustomerMapScreen}
          
        /> 
        {/* <CustomerSwitch.Screen
          name="Customer"
          component={CustomerSwitch}
          
        /> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
};
