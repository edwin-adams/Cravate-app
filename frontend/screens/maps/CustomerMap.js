import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Button} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

//basic map setup
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 44.644166 ,
  longitude: -63.591389,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};


const getTrucksAPI = "http://3.239.61.7:3000/truck/getall";

export default function App({navigation}) {


  const [foodtruckLocations, setFoodtruckLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [markers, setMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [query, setQuery] = useState('');
   
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      console.log('Location is ', location)
      setUserLocation(location);
    })();
  }, []);

  useEffect(() => {
    // fetch data from API and set markers
    fetch("http://3.239.61.7:3000/truck/getall")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      
        const trucks = data.filter((truck) => truck.isAvailable);
        console.log("Trucks are ",trucks)
        const newMarkers = trucks.map((truck) => ({
          ...truck,
          location: {
            latitude: Number(truck.location.latitude),
            longitude: Number(truck.location.longitude),
          },
        }));
        console.log("Markers are ", newMarkers)
        setMarkers(newMarkers);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = () => {
    // call API with the search query
    fetch(`http://3.239.61.7:3000/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({search: query}) // convert data to JSON format
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Data is " ,data);
      
        const trucks = data.filter((truck) => truck.isAvailable);
        console.log("Trucks are ",trucks)
        const newMarkers = trucks.map((truck) => ({
          ...truck,
          location: {
            latitude: Number(truck.location.latitude),
            longitude: Number(truck.location.longitude),
          },
        }));
        console.log("Markers are ", newMarkers)
        setMarkers(newMarkers);
        setIsLoading(false);
      })
      .catch(error => {
        // handle the error
        console.error(error);
      });
  };

  const handleMarkerPress = () => {
    setShowButton(true);
  };

  //send users to google maps
  const handleGetDirections = (latitude, longitude) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleSignOut = () => {
    console.log('Sign Out');
    navigation.navigate('UserLogin');
  };

  const handleDeleteAccount = async () => {
    // Uncomment this
    // try {
    //   const response = await axios.delete('http://3.239.61.7:3000/user/delete', {
    //     data: {
    //       username: username
    //     },
    //   });
    //   console.log(response.data); // "User Deleted."
    //   // Redirect to another page
    //   navigation.navigate('UserLogin');
    // } catch (error) {
    //   console.log("Error " + error);
    // }
    // console.log("Delete account");
  };

  return (
  

    
  

    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
        <View style={styles.appbar}>
        <Appbar.Header style={styles.appbarContent}>
          <Appbar.Action icon="logout" accessibilityLabel="Menu" onPress={handleSignOut} />
          <Appbar.Content title="Cravate"  style={{alignItems:'center', top: -10}}/>
          <Appbar.Action icon="delete" title="Delete Account" onPress={handleDeleteAccount} />
        </Appbar.Header>
        </View>

        
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION} showsCompass={false}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.location}
              title={marker.truck_name}
              //onPress= {handleGetDirections(marker)}
              //onPress= {() => console.log("Callout pressed")}
              onCalloutPress={ () => console.log("Callout pressed")}
              onPress={handleMarkerPress}
            >  

            <Callout>
               <View style={styles.calloutContainer}>
                 <Text style={styles.calloutText}>{marker.truck_name}</Text>
                 <View style={styles.flexRow}>
                    <Text>{marker.address}</Text>
                    <Text>, {marker.city}</Text>
                 </View>
                 {marker.start_time && marker.end_time ?   <View style={styles.flexRow}>
                    <Text>Opening Hours: {marker.start_time}</Text>
                    <Text> - {marker.end_time}</Text>
                 </View> : null}
                 
                 {/* <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => handleGetDirections(marker.location.latitude, marker.location.longitude)}>
                    <Text style={styles.directionsButtonText}>Get Directions</Text>
                  </TouchableOpacity> */}
              </View>
            </Callout>
          </Marker>

          ))}

          {userLocation ? <Marker
              key={21}
              coordinate={userLocation.coords}
              title={"Your location"}
              >
                <Image source={require("../../assets/icons8-user-location-53.png")}></Image>
              </Marker>            
           : null}
        </MapView>
        {/* {showButton && (
          <View style={styles.buttonContainer}> 
            <Text>Button</Text>
          </View>
        )} */}



        <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
          placeholder="Search here"
          onChangeText={setQuery}
          value={query}
          onSubmitEditing={handleSearch}
          />
        </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  calloutContainer: {
    width: 220,
  },
  calloutText: {
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2,
  },
  appbarContent: {
    alignItems: 'flex-end',
    //textAlign: 'center',
    height: 35,
    backgroundColor: 'white',
  },
  inputContainer: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 18,
    paddingLeft:20,
  },
  directionsButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    borderRadius: 5,
    
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
});