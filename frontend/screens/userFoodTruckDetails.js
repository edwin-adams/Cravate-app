import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
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

    const fullStarIcons = [...Array(avgRating)].map((_, i) => (
        <AntDesign key={`full-${i}`} name="star" size={24} color="gold" />
    ));

    const emptyStarIcons = [...Array(emptyStars)].map((_, i) => (
        <AntDesign key={`empty-${i}`} name="staro" size={24} color="gold" />
    ));

    const handlePress = (num) => {
        setRating(num);
    };

    const submitRating = async () => {
        const aa = await axios.post('http://3.239.61.7:3000/truck/ratings', {
            "truckId": truckId,
            "ratings": rating,
        });
        console.log(JSON.stringify(aa));
        Alert.alert('Thank you for your review');
    }
    
    useEffect(() => {
        setMenu(marker?.available_dishes);
        setTruckId(marker?._id);
        if (marker.ratings !== null && marker.ratings !== undefined)  
            setAvgRating(Math.floor(marker?.ratings));
        setEmptyStars(maxRating - avgRating);
    },[menu, truckId, avgRating, emptyStars])
    
    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
          <Text style={{fontSize:18}}>{item}</Text>
        </View>
    );
    
    // Display on screen
    return (
        <FlatList style={{ padding: 10,flex:1 }}
        data = {[1]}
        contentContainerStyle = {{flexGrow:1}}
        renderItem = {() => {
        
        return <View style={{flex:1}}>
            
            <Text style={{ fontSize: 35, fontWeight: 'bold', marginBottom: 10,textAlign:"center" }}>{marker.truck_name}</Text>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}>Menu</Text>
            <FlatList data={menu} renderItem={renderItem} keyExtractor={(item) => item} />

            <Text style={{ fontSize: 25, fontWeight: 'bold', marginVertical: 10 }}>Average Customer Rating</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {fullStarIcons}
                {emptyStarIcons}
            </View>

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
            <Button mode="contained" onPress={submitRating}> Submit Rating</Button>

        </View>
        }}
        />
    );
}