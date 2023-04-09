import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';


export const FoodTruckDetails = ({ navigation }) => {
  //Get vendorID passed from food truck list or vendor details page
  const route = useRoute();
  const { vendorId } = route.params;

  // Store food truck object in foodTruck
  const [foodTruck, setFoodTruck] = useState(null);


  useEffect(() => {
    fetch('http://3.239.61.7:3000/truck/getByVendorId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ vendorId: vendorId })
    })
      .then(response => response.json())
      .then(data => setFoodTruck(data))
      .catch(error => console.error(error));
  }, [])

  // If food truck is empty, display temporary screen
  if (!foodTruck) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  //   const fullStarIcons = [...Array(Math.floor(foodTruck?.ratings))].map((_, i) => (
  //     <AntDesign key={`full-${i}`} name="star" size={24} color="gold" />
  //   ));
  // }

  // const emptyStarIcons = () => {
  //   if (foodTruck?.ratings !== null && foodTruck?.ratings !== undefined) {
  //     console.log(1)
  //      [Array((5 - Math.floor(foodTruck?.ratings)))].map((_, i) => {
  //       console.log('ddfdfdf')
  //       return <AntDesign key={`empty-${i}`} name="staro" size={24} color="gold" />
  //     })
  //     for (let i = 0; i < (5 - Math.floor(foodTruck?.ratings)); i++) {
  //       console.log('aa', typeof i)
        
  //     }

  //     // [Array(5 - foodTruck?.ratings)].map((_, i) => {
  //     //    return <AntDesign key={`empty-${i}`} name="staro" size={24} color="gold" />
  //     // })
  //   } 
  // }

  // const fullStarIcons = () => {
  //   if (foodTruck?.ratings !== null && foodTruck?.ratings !== undefined) {
  //     for (let i = 0; i < (Math.floor(foodTruck?.ratings)); i++) {
  //       return <AntDesign key={`aempty-${i}`} name="star" size={24} color="gold" />
  //     }
  //   } 
  // }

  //   const emptyStarIcons = [...Array(5 - Math.floor(foodTruck?.ratings))].map((_, i) => (
  //     <AntDesign key={`empty-${i}`} name="staro" size={24} color="gold" />
  //   ));
  // }

  // display on screen
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Food Truck Name : {foodTruck.truck_name}</Text>
        <Text style={styles.cardText}>Truck Code : {foodTruck.truck_code}</Text>
        <Text style={styles.cardText}>Address : {foodTruck.address}</Text>
        <Text style={styles.cardText}>City : {foodTruck.city}</Text>
        <Text style={styles.cardText}>Dishes : {[...foodTruck.available_dishes, ...foodTruck.unavailable_dishes].join(',')}</Text>
        <Text style={styles.cardText}>Location:</Text>
        {/* Display the location on map */}
        <MapView provider={PROVIDER_GOOGLE} style={{ width: '100%', height: 200 }} region={{
          latitude: parseFloat(foodTruck.location.latitude),
          longitude: parseFloat(foodTruck.location.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
          <Marker coordinate={{ latitude: parseFloat(foodTruck.location.latitude), longitude: parseFloat(foodTruck.location.longitude) }} />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});