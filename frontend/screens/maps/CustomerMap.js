import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

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

export default function App() {

  //const [foodtruckLocations, setFoodtruckLocations] = useState([]);
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

  // const showFoodTrucks = () => {
  //   return foodtruckLocations.map((item, index) => {
  //     const handleGetDirections = () => {
  //       const latitude = parseFloat(item.location.latitude);
  //       const longitude = parseFloat(item.location.longitude);
  //       const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  //       Linking.openURL(url);
  //     };
  //     return (
  //       <Marker
  //         key={index}
  //         coordinate={{
  //           latitude: parseFloat(item.location.latitude),
  //           longitude: parseFloat(item.location.longitude),
  //         }}
  //         title={item.name}
  //         description={item.description}
  //       >
  //         <Callout>
  //           <TouchableOpacity onPress={handleGetDirections}>
  //             <View style={styles.calloutContainer}>
  //               <Text style={styles.calloutText}>{item.title}</Text>
  //               <Text>{item.description}</Text>
  //             </View>
  //           </TouchableOpacity>
  //         </Callout>
  //       </Marker>
  //     );
  //   });
  // };

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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
        <TextInput
        style={styles.input}
        onChangeText={setQuery}
        value={query}
        onSubmitEditing={handleSearch}
        />  
        <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>

        
        
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.location}
              title={marker.truck_name}
            >  
              
              <Callout>
             <TouchableOpacity >
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
               
             </View>
             </TouchableOpacity>
           </Callout>
              
            </Marker>
          ))}

          {userLocation ?  <Marker
              key={21}
              coordinate={userLocation.coords}
              title={"Your location"}
              >
                <Image source={require("../../assets/icons8-user-location-53.png")}></Image>
              </Marker>
              //image={require("./assets/icons8-user-location-53.png")}
              
              //style={{height: 1000, width: 1000}}
            
           : null}
        </MapView>
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
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  calloutContainer: {
    width: 220,
  },
  calloutText: {
    fontWeight: 'bold',
  },
  directionsText: {
    color: 'blue',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  flexRow: {flexDirection: "row"},
  input: {
    height: 40,
    marginTop: 30,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});