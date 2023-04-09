import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { IconButton, TextInput, Button,Appbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export const VendorLanding =({ navigation }) => {
  
  // Get username from parameters
  const route = useRoute();
  const { username } = route.params;
  
  // Food truck model variables
  const [vendorId,setVendorId] = useState('');
  const [foodTruck,setFoodTruck] = useState(null);
  const [menu, setMenu] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [truckName,setTruckName] = useState('');
  const [latitude,setLatitude] = useState(44.6461676);
  const [longitude,setLongitude] = useState(-63.7029373);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // Variable to load dynamic new dishes
  const [newDish, setNewDish] = useState('');
  
  // To show the slider for clock
  const [showStartPickerModal, setShowStartPickerModal] = useState(false);
  const [showEndPickerModal, setShowEndPickerModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch vendor object to get vendorID
  const fetchVendor = async () => {
    fetch('http://3.239.61.7:3000/vendor/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
        })
        .then(response => response.json())
        .then(data => {
          setVendorId(data._id);
          fetchMenu(data._id);
        })
        .catch(error => console.error(error));
  };

  // Fetch food truck object using vendorID
  const fetchMenu = async (vendorID) => {
    fetch('http://3.239.61.7:3000/truck/getByVendorId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ vendorId: vendorID })
        })
        .then(response => response.json())
        .then(data => {
          setFoodTruck(data);
          setMenu(data.available_dishes);
          setUnavailable(data.unavailable_dishes);
          setTruckName(data.truck_name);
          setLatitude(parseFloat(data.location.latitude));
          setLongitude(parseFloat(data.location.longitude));
          
          // Convert String to datetime object
          const dateStartString = data.start_time;
          const [start_hours,start_minutes] = dateStartString.split(':').map((str) => parseInt(str, 10));
          const start_isAM = dateStartString.endsWith('am');
          const start_date = new Date();
          start_date.setHours(start_isAM ? start_hours : start_hours + 12);
          start_date.setMinutes(start_minutes);
          setStartTime(start_date);

          // Convert String to datetime object
          const dateEndString = data.end_time;
          const [end_hours, end_minutes] = dateEndString.split(':').map((str) => parseInt(str, 10));
          const end_isAM = dateEndString.endsWith('am');
          const end_date = new Date();
          end_date.setHours(end_isAM ? end_hours : end_hours + 12);
          end_date.setMinutes(end_minutes);
          setEndTime(end_date);
        })
        .catch(error => console.error(error));
  };
  useEffect(() => {

    console.log("username in useEffect " + username);
    fetchVendor();
    console.log("VendorID in useEffect " + vendorId);
  }, [username,vendorId]);

  console.log(foodTruck);
  console.log(foodTruck?.location?.latitude);
  console.log(foodTruck?.location?.longitude);
  console.log(foodTruck?.truck_name);
  console.log(foodTruck?.available_dishes);
  console.log(foodTruck?.unavailable_dishes);
  console.log(foodTruck?.start_time);
  console.log(foodTruck?.end_time);
  console.log(menu);
  console.log(unavailable);
  console.log(truckName);
  console.log(latitude);
  console.log(longitude);
  console.log(startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  console.log(endTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  // Move a dish from available to unavailable dish
  const handleRemove = (item) => {
    const newMenu = menu.filter((dish) => dish !== item);
    setMenu(newMenu);
    setUnavailable([...unavailable, item]);
  };

  // Delete a dish entirely
  const handleDelete = (item, list) => {
    const newList = list.filter((dish) => dish !== item);
    if (list === menu) {
      setMenu(newList);
    } else {
      setUnavailable(newList);
    }
  };

  // Add a dish to menu
  const handleAdd = () => {
    if (newDish.length > 0) {
      setMenu([...menu, newDish]);
      setNewDish('');
    }
  };
  
  // Change the coordinates of latitude and longitude
  const handleMapPress = event => {
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
  };

  // Start time change function
  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartPickerModal(false);
    if (selectedTime !== undefined) {
      setStartTime(selectedTime);
    }
  };

  // End time change function
  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndPickerModal(false);
    if (selectedTime !== undefined) {
      setEndTime(selectedTime);
    }
  };

  // Display slider
  const showStartPicker = () => {
    setShowStartPickerModal(true);
  };

  // Display slider
  const showEndPicker = () => {
    setShowEndPickerModal(true);
  };

  
  // Update food truck details
  const updateDetails = async () => {
    const aa = await axios.post('http://3.239.61.7:3000/truck/update', {
            "vendorId": vendorId,
            "available_dishes": menu,
            "unavailable_dishes": unavailable,
            "location": { "latitude": latitude, "longitude": longitude },
            "start_time": startTime,
            "end_time": endTime
        });
        console.log(JSON.stringify(aa));
        Alert.alert('Updated successfully');
  };

  // Display the menu items and unavailable items 
  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
      <Text>{item}</Text>
      <View style={{ flexDirection: 'row' }}>
        {unavailable.includes(item) ? (
          <Button
            mode="outlined"
            onPress={() => {
              handleDelete(item, unavailable);
              setMenu([...menu, item]);
            }}
          >
            Move to menu
          </Button>
        ) : (
            <><Button
                icon={({ color, size }) => <IconButton icon="delete" color={color} size={size} />}
                onPress={() => handleDelete(item, menu)} />
                <Button mode="outlined" onPress={() => handleRemove(item)}>
                    Remove from menu
                </Button></>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Signout function
  const handleSignOut = () => {
    console.log("Sign Out");
    navigation.navigate('VendorLogin');
  };

  // Delete vendor and food truck account
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete('http://3.239.61.7:3000/vendor/delete', {
        data: {
          username: username
        },
      });
      console.log(response.data); // "User Deleted."
      // Redirect to another page
      navigation.navigate('VendorLogin');
    } catch (error) {
      console.log("Error " + error);
    }
    console.log("Delete account");
  };


  // Display on screen
  return (
    <FlatList style={{ padding: 10,flex:1 }}
    data = {[1]}
    contentContainerStyle = {{flexGrow:1}}
    renderItem = {() => {
      
      return <View style={{flex:1}}>
        
        <Appbar.Header>
          <Appbar.Action icon="logout" accessibilityLabel="Menu" onPress={handleSignOut} />
          <Appbar.Content title={truckName}  style={{alignItems:"center"}}/>
          <Appbar.Action icon="delete" title="Delete Account" onPress={handleDeleteAccount} />
        </Appbar.Header>

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Menu</Text>
        <FlatList data={menu} renderItem={renderItem} keyExtractor={(item) => item} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Unavailable Dishes</Text>
        <FlatList data={unavailable} renderItem={renderItem} keyExtractor={(item) => item} />
        
        
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Add a dish</Text>
        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <TextInput
            label="Add a dish"
            value={newDish}
            onChangeText={(text) => setNewDish(text)}
            style={{ flex: 1, marginRight: 10 }}
            />
            <Button mode="contained" onPress={handleAdd}>
              Add
            </Button>
        </View>


        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{fontSize: 18, color: "#000", margin:10, }}>Starting time</Text>
              <Button mode="contained" style={{marginVertical: 10}} onPress={showStartPicker}>Select </Button>
              {showStartPickerModal && (
                <DateTimePicker
                  testID="startPicker"
                  value={startTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={handleStartTimeChange}
                />
              )}
              {startTime && <Text>Start Time: {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
        </View>
            
        <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:20 }}>
          <Text style={{fontSize: 18, color: "#000", margin:10, marginRight:18, }}>Ending time</Text>
          <Button mode="contained" style={{marginVertical: 10}} onPress={showEndPicker}>Select </Button>
          {showEndPickerModal && (
            <DateTimePicker
              testID="endPicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleEndTimeChange}
            />
          )}
          {endTime && <Text>End Time: {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
        </View>

        <MapView provider={PROVIDER_GOOGLE} onPress = {handleMapPress} style={{ width: '100%', height: 200 }} region={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,            
        }}>
          <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
        </MapView>
        
        <Button mode="contained" onPress={updateDetails} style={{marginVertical:10}}>Update Details</Button>
      </View>
    }}
    />
  );
}
