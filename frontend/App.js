import React, { useState, useEffect } from "react";
import HomeScreen from "./screens/HomeScreen";
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
import { VendorLanding } from "./screens/VendorLanding";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserFoodTruckDetails } from "./screens/userFoodTruckDetails";

const Stack = createNativeStackNavigator();

export default function App() {

  //Variable for storing role from AsyncStorage
  const [selectedRole, setSelectedRole] = useState(null);

  //Will be run when the app starts first
  useEffect(() => {
    //Retrieve the selected role from AsyncStorage
    async function fetchSelectedRole() {
      const storedRole = await AsyncStorage.getItem('selectedRole');
      setSelectedRole(storedRole);
    }

    //Call the retrievefunction
    fetchSelectedRole();
  }, []);

  
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
            name="splash"
            component={SplashScreen}
            options = {{headerShown:false}}
          />

          {/* Screen for user login */}
          <Stack.Screen 
            name="UserLogin"
            component={UserLoginScreen}
            options = {{headerShown:false}}
          />
        
        {/* Screen for admin login */}
          <Stack.Screen 
            name="AdminLogin"
            component={AdminLoginScreen}
            options = {{headerShown:false}}
          />

          {/* Screen for vendor login */}
          <Stack.Screen 
            name="VendorLogin"
            component={VendorLoginScreen}
            options = {{headerShown:false}}
          />

        {/* Screen for admin home page */}
        <Stack.Screen 
            name="adminLanding"
            component={AdminLanding}
            options = {{headerShown:false}}
        />

        {/* Screen for listing all vendors in the admin section */}
        <Stack.Screen 
          name="listVendor"
          component={ListVendor}
          options = {{title: "Vendors"}}
        />

        {/* Screen for listing all users in the admin section */}
        <Stack.Screen 
          name="listUser"
          component={ListUser}
          options = {{title: "Users"}}
        />

        {/* Screen for listing all food trucks in the admin section */}
        <Stack.Screen 
          name="listFoodTruck"
          component={ListFoodTruck}
          options = {{title: "Food Trucks"}}
        />

        {/* Screen for displaying user details when a particular user is selected from the user list in admin section*/}
        <Stack.Screen 
          name="userDetails"
          component={UserDetails}
          options = {{}}
        />

        {/* Screen for displaying food truck details when a particular food truck is selected from the food truck list in admin section*/}
        <Stack.Screen 
          name="foodTruckDetails"
          component={FoodTruckDetails}
          options = {{}}
        />

        {/* Screen for displaying vendor details when a particular vendor is selected from the vendor list in admin section*/}
        <Stack.Screen 
          name="vendorDetails"
          component={VendorDetails}
          options = {{}}
        />

        {/* Screen for user registration */}
        <Stack.Screen 
          name="userRegister"
          component={UserRegisterScreen}
          options = {{headerShown:false}}
        />

        {/* Screen for vendor registration */}
        <Stack.Screen 
          name="vendorRegister"
          component={VendorRegisterScreen}
          options = {{headerShown:false}}
        />

        {/* Screen for food truck registration */}
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
        
        {/* Screen for vendor homepage */}
        <Stack.Screen
          name = "VendorLanding"
          component={VendorLanding}
          options = {{headerShown:false}}
          />
        
         <Stack.Screen
          name="CustomerLanding"
          component={CustomerLanding}
          options ={{title: "Customer Landing"}}
        />

        <Stack.Screen
          name="UserFoodTruckDetails"
          component={UserFoodTruckDetails}
          options={{title: "Food Truck"}}
        />

        {/* Screen for user homepage */}
        <Stack.Screen
          name="CustomerMap"
          component={CustomerMapScreen}
          options={{headerShown:false}}
        /> 
        {/* <CustomerSwitch.Screen
          name="Customer"
          component={CustomerSwitch}
          
        /> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
};
