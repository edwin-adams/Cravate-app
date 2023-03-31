import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity,Dimensions, ScrollView } from 'react-native';
import { IconButton, TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export const VendorLanding =({ navigation }) => {
    const route = useRoute();
    const { username } = route.params;
  
    const [loading, setLoading] = useState(true);
  
    const [truck,setTruck] = useState(null);
    const [truckName,setTruckName] = useState('');
    const [menu, setMenu] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [latitude,setLatitude] = useState(44.6461676);
    const [longitude,setLongitude] = useState(-63.7029373);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [vendorId,setVendorId] = useState('');
    
    const [newDish, setNewDish] = useState('');
  
    const [showStartPickerModal, setShowStartPickerModal] = useState(false);
    const [showEndPickerModal, setShowEndPickerModal] = useState(false);
  
    const fetchMenu = async () => {
      try {
        const res = await axios.post('http://3.239.61.7:3000/truck/getByVendorId',{
          vendorId: vendorId
        });
        setLoading(false);
  
        setTruck(res);
        console.log(res.data)
        console.log(res.data.available_dishes);
        console.log(res.data.unavailable_dishes);
        console.log(res.data.truck_name);
        console.log(res.data.location.latitude);
        console.log(res.data.location.longitude);
  
        setMenu(res.data.available_dishes);
        setUnavailable(res.data.unavailable_dishes);
        setTruckName(res.data.truck_name);
        setLatitude(parseFloat(res.data.location.latitude));
        setLongitude(parseFloat(res.data.location.longitude));
  
        console.log(menu);
        console.log(unavailable);
        console.log(truckName);
        console.log(latitude);
        console.log(longitude);
        const dateStartString = res.data.start_time;
        const [start_hours,start_minutes] = dateStartString.split(':').map((str) => parseInt(str, 10));
        const start_isAM = dateStartString.endsWith('am');
        const start_date = new Date();
        start_date.setHours(start_isAM ? start_hours : start_hours + 12);
        start_date.setMinutes(start_minutes);
        setStartTime(start_date);
  
        const dateEndString = res.data.end_time;
        const [end_hours, end_minutes] = dateEndString.split(':').map((str) => parseInt(str, 10));
        const end_isAM = dateEndString.endsWith('am');
        const end_date = new Date();
        end_date.setHours(end_isAM ? end_hours : end_hours + 12);
        end_date.setMinutes(end_minutes);
        setEndTime(end_date);
      } catch (err) {
        console.error(err);
      }
    };
  
    const fetchVendor = async () => {
      fetch('http://3.239.61.7:3000/vendor/get', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username: username })
          })
          .then(response => response.json())
          .then(data => setVendorId(data._id))
          .catch(error => console.error(error));
    };
  
    useEffect(() => {
      console.log(username);
      fetchVendor();
      console.log(vendorId);
      fetchMenu();
  
      if (!startTime) {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }, [username,vendorId]);
  
    const handleRemove = (item) => {
      const newMenu = menu.filter((dish) => dish !== item);
      setMenu(newMenu);
      setUnavailable([...unavailable, item]);
    };
  
    const handleDelete = (item, list) => {
      const newList = list.filter((dish) => dish !== item);
      if (list === menu) {
        setMenu(newList);
      } else {
        setUnavailable(newList);
      }
    };
  
    const handleAdd = () => {
      if (newDish.length > 0) {
        setMenu([...menu, newDish]);
        setNewDish('');
      }
    };
  
    const handleMapPress = event => {
      setLatitude(event.nativeEvent.coordinate.latitude);
      setLongitude(event.nativeEvent.coordinate.longitude);
    };
  
    const handleStartTimeChange = (event, selectedTime) => {
      setShowStartPickerModal(false);
      if (selectedTime !== undefined) {
        setStartTime(selectedTime);
      }
    };
  
    const handleEndTimeChange = (event, selectedTime) => {
      setShowEndPickerModal(false);
      if (selectedTime !== undefined) {
        setEndTime(selectedTime);
      }
    };
  
    const showStartPicker = () => {
      setShowStartPickerModal(true);
    };
  
    const showEndPicker = () => {
      setShowEndPickerModal(true);
    };
  
    const updateDetails = async () => {
      try {
        data = {
          vendorId: vendorId,
          available_dishes : menu,
          unavailable_dishes : unavailable,
          location: {
            latitude: latitude,
            longitude: longitude
          },
          start_time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end_time: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        console.log(JSON.stringify(data));
        const res = await axios.post('http://3.239.61.7:3000/truck/getByVendorId',{
          data
        });
        console.log(JSON.stringify(res));
        navigation.navigate("vendorLanding",{username});
      }
      catch (err) {
        console.error(err);
      }
    }
    
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
  
    if (loading) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <FlatList style={{ padding: 10,flex:1 }}
      data = {[1]}
      contentContainerStyle = {{flexGrow:1}}
      renderItem = {() => {
        
        return <View style={{flex:1}}>
          <Text style={{fontSize:30,textAlign:"center",fontWeight: 'bold',marginBottom:10}}>{truckName}</Text>
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
          <MapView onPress = {handleMapPress} style={{ width: '100%', height: 200 }} region={{
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,            
          }}>
            <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
          </MapView>
          <Button mode="contained" onPress={updateDetails}>Update Details</Button>
        </View>
      }}
      />
    );
}
