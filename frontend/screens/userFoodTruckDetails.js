import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from "react-native-paper";

export const UserFoodTruckDetails = ({navigation}) => {
    //Get marker passed from customer landing page
    const route = useRoute();
    const { marker } = route.params;

    const [menu,setMenu] = useState([]);
    const [rating, setRating] = useState(0);
    const [avgRating,setAvgRating] = useState(0);
    const [truckId,setTruckId] = useState('');
    const maxRating = 5;
    const [emptyStars,setEmptyStars] = useState(5);

    useEffect(() => {
        setMenu(marker.available_dishes);
        setTruckId(marker._id);
        setAvgRating(Math.floor(parseFloat(marker.ratings)));
        setEmptyStars(maxRating - avgRating);
    },[])

    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
          <Text style={{fontSize:18}}>{item}</Text>
        </View>
    );

    return (
        <FlatList style={{ padding: 10,flex:1 }}
        data = {[1]}
        contentContainerStyle = {{flexGrow:1}}
        renderItem = {() => {
        
        return <View style={{flex:1}}>
            
            <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 10,textAlign:"center" }}>{marker.truck_name}</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}>Menu</Text>
            <FlatList data={menu} renderItem={renderItem} keyExtractor={(item) => item} />


            <Text style={{ fontSize: 25, fontWeight: 'bold', marginVertical: 10 }}>Rate the food truck</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity key={num} onPress={() => handlePress(num)}>
                    <AntDesign
                        name={rating >= num ? 'star' : 'staro'}
                        size={24}
                        color="gold"
                    />
                </TouchableOpacity>
                ))}
            </View>
            <Text style={{ fontSize: 20 }}>You rated {rating} stars.</Text>
            
        </View>
        }}
        />
    );
}