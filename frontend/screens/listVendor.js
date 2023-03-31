import React, { useState, useEffect, useCallback } from "react";
import {  StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from '@react-navigation/native';

export const ListVendor = ({navigation}) => {
    // variable to store all the vendor list 
    const [vendors, setVendors] = useState([]);

    // If there has been any change in the number of users it will be refreshed
    const fetchVendors = useCallback(() => {
      fetch('http://3.239.61.7:3000/vendors/getall')
          .then(response => response.json())
          .then(data => setVendors(data))
          .catch(error => console.error(error))
  }, []);

  // Constructor function kind of
  useEffect(() => {
      setTimeout(fetchVendors, 3000);
  }, [fetchVendors]);

  // Call the function
  useFocusEffect(fetchVendors);

  // pass the details of that particular user to user details page
  const handleCardClick = (username) => {
      navigation.navigate('vendorDetails', { username });
  };

  // display on screen
  return (
      <View style={styles.container}>
          <Text style={styles.heading}>Vendor List</Text>
          {/* display all items from vendor list */}
          {vendors.map(vendor => (
            // touchable list
              <TouchableOpacity
                  key={vendor.username}
                  style={styles.card}
                  onPress={() => handleCardClick(vendor.username)}
              >
                  <Text style={styles.cardText}>{vendor.username}</Text>
              </TouchableOpacity>
          ))}
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
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
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
    },
  });