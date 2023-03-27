import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";

export const ListVendor = ({navigation}) => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        fetch('http://3.239.61.7:3000/vendors/getall')
        .then(response => response.json())
        .then(data => setVendors(data))
        .catch(error => console.error(error));
    }, []);

    const handleCardClick = (username) => {
        navigation.navigate('vendorDetails', { username });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Vendor List</Text>
        {vendors.map(vendor => (
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