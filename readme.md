<h1 style ="font-family: Arial" align="center"><b>Cravate</b></h1>

<p style ="font-family: Arial">The Cravate app, which is compatible with Android devices, enables users to find food trucks in close proximity and receive navigation instructions via Google Maps.</p>

<hr>

<h2 style ="font-family: Arial">Dependencies</h2> 

<b>Dependencies for nodejs backend</b><br>

```
"chai-as-promised": "^7.1.1",
"chai-http": "^4.3.0",
"express": "^4.18.2",
"sinon": "^15.0.3"

"bcrypt": "^5.1.0",
"body-parser": "^1.20.1",
"chai": "^4.3.7",
"expect": "^29.5.0",
"http": "^0.0.1-security",
"istanbul": "^0.4.5",
"jest": "^29.5.0",
"jsonwebtoken": "^9.0.0",
"jwt-decode": "^3.1.2",
"mocha": "^10.2.0",
"mongoose": "^6.9.1",
"nodemon": "^2.0.20",
"nyc": "^15.1.0",
"pm2": "^5.2.2",
"superset": "^2.0.1",
"supertest": "^6.3.3"
```
After cloning the project on the local machine
1. Navigate to the backend folder on terminal through command `cd backend`
2. To install backend dependencies, run command `npm install`

<b>Frontend Dependencies for react native application</b><br>

```
"@react-native-async-storage/async-storage": "1.17.11",
"@react-native-community/datetimepicker": "6.7.3",
"@react-navigation/core": "github:react-navigation/core",
"@react-navigation/native": "^6.1.6",
"@react-navigation/native-stack": "^6.9.12",
"axios": "^1.3.4",
"expo": "~48.0.6",
"expo-location": "^15.1.1",
"expo-status-bar": "~1.4.4",
"react": "18.2.0",
"react-hook-form": "^7.43.5",
"react-native": "0.71.6",
"react-native-maps": "1.3.2",
"react-native-paper": "^5.4.1",
"react-native-paper-form-builder": "^2.1.2",
"react-native-safe-area-context": "4.5.0",
"react-native-screens": "~3.20.0",
"react-native-vector-icons": "^9.2.0"
```

After cloning the project on the local machine
1. Navigate to the frontend folder on terminal through command `cd frontend`
2. To install react native dependencies, run command `npm install`

<hr>

<h2 style ="font-family: Arial">Build/Deployment instructions</h2> 

Users can install the current version of application by installing the apk file available at - https://expo.dev/artifacts/eas/s27AfSrPEntRgEWvcbEcaK.apk 

<b>Backend</b><br>

Backend for this application has been written using node js. To build the node js backend -

1. Navigate to the backend folder on terminal through command `cd backend`
2. To install backend dependencies, run command `npm install`

<figure align="center">
  <img src="images/backend_dependencies_installation.png" alt="backend dependencies installation" width="600" />
  <figcaption>Backend dependencies installation.</figcaption>
</figure>



3. To start the node js server, run command `npm start`. The entry point of node js application is through index.js which runs the application on port 3000 unless specified otherwise.
4. Access the API's through application such as postman through localhost. The format to access API on local server is http://localhost:3000/{API}

<b>Frontend</b><br>

Frontend for this application has been written using React native. To build the node js backend -

1. Navigate to the frontend folder on terminal through command `cd frontend`
2. To install frontend dependencies, run command `npm install`

<figure align="center">
  <img src="images/frontend_dependecies_installation.png" alt="frontend dependencies installation" width="600" />
  <figcaption>Frontend dependencies installation.</figcaption>
</figure>


3. To launch the project in local/development mode, run the command `npx expo start`. Compiling the application and deploying it on Expo servers will generate a QR code. This code can be scanned using the Expo Go app, which is accessible from the Android Playstore and Apple app store, to access the application.

<figure align="center">
  <img src="images/frontend_run.png" alt="Launch react native application" width="600" />
  <figcaption>Launch react native application.</figcaption>
</figure>

<figure align="center">
  <img src="images/expo_go_app.jpeg" alt="Expo GO application" height="400" />
  <figcaption>Expo Go  application.</figcaption>
</figure>

<figure align="center">
  <img src="images/splash_screen.jpeg" alt="Running Cravate on Expo Go" height="400" />
  <figcaption>Expo Go  application.</figcaption>
</figure>

4. To launch an apk version of application, run the command `eas build -p android --profile preview`. This will build the application into an apk file and host it on expo servers.

<figure align="center">
  <img src="images/build_apk.png" alt="Building apk file" width="600" />
  <figcaption>Building apk file.</figcaption>
</figure>

The starting point of the application is App.js, and all the other files can be located in the "screens" folder. The "assets" folder contains the images and logos used in the application, while the "app.json" file holds application metadata such as the name of the app, its version, and the Google Maps API key.

<hr>

<h2 style ="font-family: Arial">Usage Scenario</h2> 

When a user starts the application for the first time, they will be able to select the role they want to choose 
<figure align="center">
  <img src="images/splash_screen.jpeg" alt="Splash Screen" height="400" />
  <figcaption>Splash Screen.</figcaption>
</figure>

Role: USER
1. After selecting the role User, we will be redirected to user login page
2. Users can login using their existing account credentials such as username and password.

<figure align="center">
  <img src="images/user_login.jpeg" alt="User Login" height="400" />
  <figcaption>User Login.</figcaption>
</figure>

3. New users who don't have an account can create one by registering through the registration page.

<figure align="center">
  <img src="images/user_registration.jpeg" alt="User Registration" height="400" />
  <figcaption>User Registration.</figcaption>
</figure>

4. After that user registration is followed by login prompt and automatic redirection to user home page.
5. The home page shows a map with all the food trucks available nearby marked by red pins.
6. The user's location is also marked by a blue pin on the map.
7. The top-rated food trucks are displayed on the home page for easy access.
8. Clicking on a food truck marker reveals a 'view details' button that displays the dishes available and average customer ratings.
9. Clicking on a marker also reveals a 'directions' icon, located at the bottom right corner of the app.

<figure align="center">
  <img src="images/user_homepage.jpeg" alt="User homepage" height="400" />
  <figcaption>User Homepage.</figcaption>
</figure>

10. Clicking on the 'directions' icon will redirect the user to Google maps with the customer's current location and food truck's location as the destination.
11. The app bar available at the top of the page allows the customer to sign out or delete their account.
12. The app provides an interactive map interface for easy navigation and location tracking.
13. The app offers a comprehensive view of available food trucks and their menus, as well as customer reviews and ratings.




Role: VENDOR
1. After selecting the role Vendor, we will be redirected to vendor login page

<figure align="center">
  <img src="images/vendor_login.jpeg" alt="Vendor login" height="400" />
  <figcaption>Vendor login.</figcaption>
</figure>

2. Users can either login with their existing username and password or sign up using the register page.
3. Vendor is prompted to fill their details and submit the form.

<figure align="center">
  <img src="images/vendor_registration.jpeg" alt="Vendor login" height="400" />
  <figcaption>Vendor registration.</figcaption>
</figure>

4. Upon submission, they are redirected to the "Add food truck details" page.
5. They are asked to enter all the necessary details about their food truck, including name, address, operating hours, menu, and location.

<figure align="center">
  <img src="images/add_food_truck.jpeg" alt="Add Food Truck" height="400" />
  <figcaption>Add Food Truck.</figcaption>
</figure>

6. Food truck details can be added by vendors.
7. Vendors are prompted to login before they can edit their dishes or perform any other action.
8. The vendors have the ability to switch the status of their dishes from available to unavailable, modify the menu by adding new dishes, adjust the start and end times of their services, and update their location.

<figure align="center">
  <img src="images/vendor_homepage.jpeg" alt="Vendor Homepage" height="400" />
  <figcaption>Vendor Home Page.</figcaption>
</figure>

9. Vendors can sign out of their account or delete it entirely through the app bar.
10. The app allows for easy management of a food truck's menu, schedule, and location.

Role: Admin
1. After selecting the role Admin, we will be redirected to Admin login page.
<figure align="center">
  <img src="images/admin_login.jpeg" alt="Admin Login" height="400" />
  <figcaption>Admin Login.</figcaption>
</figure>
2. After the admin logs in, they will be able to see a screen that has listed roles which are used in the application.

<figure align="center">
  <img src="images/admin_homepage.jpeg" alt="Admin HomePage" height="400" />
  <figcaption>Admin Homepage.</figcaption>
</figure>

3. If the admin selects user, they will be able to see all users listed 

<figure align="center">
  <img src="images/user_list.jpeg" alt="User list" height="400" />
  <figcaption>User list.</figcaption>
</figure>

4. User details such as Name and username are displayed when clicked. Admin has the option to delete the record.

<figure align="center">
  <img src="images/user_details.jpeg" alt="User details" height="400" />
  <figcaption>User details.</figcaption>
</figure>

5. If the admin clicks on the vendor role in home page, they will be able to see all the vendors listed

<figure align="center">
  <img src="images/vendor_list.jpeg" alt="Vendor list" height="400" />
  <figcaption>Vendor list.</figcaption>
</figure>

6. Upon the administrator's selection of a particular vendor, the system will display the vendor's comprehensive information, including their name and username. The administrator will have the privilege to remove the vendor from the system.

<figure align="center">
  <img src="images/vendor_details.jpeg" alt="Vendor details" height="400" />
  <figcaption>Vendor details.</figcaption>
</figure>

7. The admin can view the details of a particular food truck by clicking on it, which is connected to the corresponding vendor.

<figure align="center">
  <img src="images/food_truck_details.jpeg" alt="Food Truck Details" height="400" />
  <figcaption>Food Truck details.</figcaption>
</figure>

8. Upon selecting the "food truck" option on the homepage, the user will be redirected to a web page that displays a list of all available food trucks.

<figure align="center">
  <img src="images/food_truck_list.jpeg" alt="Food Truck list" height="400" />
  <figcaption>Food Truck list.</figcaption>
</figure>

9. Upon an administrator clicking on a specific food truck, the system will retrieve and display the relevant information and details pertaining to that food truck.

<figure align="center">
  <img src="images/food_truck_details.jpeg" alt="Food Truck Details" height="400" />
  <figcaption>Food Truck details.</figcaption>
</figure>





























