import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, TextInput, List, IconButton, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

export const AddFoodTruck =({ navigation }) => {
  
  const [foodTruckName, setFoodTruckName] = useState('');
  const [foodTruckNameError, setFoodTruckNameError] = useState('');
  const [foodTruckCode, setFoodTruckCode] = useState('');
  const [foodTruckCodeError, setFoodTruckCodeError] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');

  const route = useRoute();
  const { username } = route.params;
  const [vendorId, setVendorId] = useState(null);


  const [text, setText] = useState('');
  const [items, setItems] = useState([]);
  
  const [latitude, setLatitude] = useState(44.64936); // initial latitude
  const [longitude, setLongitude] = useState(-63.57302); // initial longitude

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPickerModal, setShowStartPickerModal] = useState(false);
  const [showEndPickerModal, setShowEndPickerModal] = useState(false);

  const [vendorResponse, setVendorResponse] = React.useState();

  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log(username);

    const getVendorId = async () => {
      try {
        const response = await fetch('http://3.239.61.7:3000/vendor/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
          })
        });
        
        const res = await response.json();
        console.log(res);
        setVendorId(res._id);
        console.log(vendorId);
        

      } catch (error) {
        console.error(error);
      }
    };
    
    getVendorId();
  
    if (!vendorId) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        
      }, 1000);
    }
  },[vendorId])
  
  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const onSubmit = async () => {
    let foodTruckNameValid = true;
    let foodTruckCodeValid = true;
    let addressValid = true;
    let cityValid = true;

    if (foodTruckName.length === 0) {
      foodTruckNameValid = false;
      setFoodTruckNameError('Food Truck Name is required');
    } else {
        setFoodTruckNameError('');
    }

    if (foodTruckCode.length === 0) {
      foodTruckCodeValid = false;
      setFoodTruckCodeError('Food Truck code is required');
    } else {
      setFoodTruckCodeError('');
    }

    if (address.length === 0) {
      addressValid = false;
      setAddressError('Address is required');
    } else {
      setAddressError('');
    }

    if (city.length === 0) {
      cityValid = false;
      setCityError('Address is required');
    } else {
      setCityError('');
    }

    if(vendorId === null){
      Alert.alert('VendorId is null')
    }

    if(foodTruckNameValid && foodTruckCodeValid && addressValid && cityValid){
        data = {
          truck_name: foodTruckName,
          truck_code: foodTruckCode,
          vendorId: vendorId,
          address: address,
          city: city,
          location : {
            latitude: latitude,
            longitude: longitude
          },
        available_dishes: items,
        unavailable_dishes: [],
        start_time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end_time: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    
        console.log(data);
        try {
          const response = await fetch('http://3.239.61.7:3000/truck/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
          });
      
          if (response.ok) {
          // The signup was successful, navigate to the next screen
            Alert.alert('Registration successful. Please login.')
            navigation.navigate('vendorLogin');
          } else {
          // There was an error with the signup, handle it appropriately
          const errorText = await response.text();
          console.error(errorText);
          // You can show an error message to the user here
          }
      } catch (error) {
          console.error(error);
          // You can show an error message to the user here
      }
    }
  }

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
  
  const handleAddItem = () => {
    if (text.trim() !== '') {
      setItems([...items, text.trim()]);
      setText('');
    }
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleMapPress = event => {
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title title="Add Food Truck Details" titleStyle={styles.title}></Card.Title>
      </Card>

      <View>
            <TextInput
              label="Food Truck Name"
              value = {foodTruckName}
              onChangeText = {setFoodTruckName}
              error = {!!foodTruckNameError}
              errorText={foodTruckNameError}
              style={styles.textinput}
            />
            {foodTruckNameError ? <Text style={styles.error}>{foodTruckNameError}</Text> : null}

            <TextInput
              label="Food Truck Code"
              value = {foodTruckCode}
              onChangeText = {setFoodTruckCode}
              error = {!!foodTruckCodeError}
              errorText={foodTruckCodeError}
              style={styles.textinput}
            />
            {foodTruckCodeError ? <Text style={styles.error}>{foodTruckCodeError}</Text> : null}

            <TextInput
              label="Address"
              value = {address}
              onChangeText = {setAddress}
              error = {!!addressError}
              errorText={addressError}
              style={styles.textinput}
            />
            {addressError ? <Text style={styles.error}>{addressError}</Text> : null}

            <TextInput
              label="City"
              value = {city}
              onChangeText = {setCity}
              error = {!!cityError}
              errorText={cityError}
              style={styles.textinput}
            />
            {cityError ? <Text style={styles.error}>{cityError}</Text> : null}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{fontSize: 18, color: "#000", margin:10, }}>Starting time</Text>
              <Button mode="contained" style={styles.button} onPress={showStartPicker}>Select </Button>
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
              <Button mode="contained" style={styles.button} onPress={showEndPicker}>Select </Button>
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

            <View>
              <Text style={styles.addDishes}>Add Dishes</Text>
              <View>
                <TextInput
                  label="Enter item"
                  value={text}
                  onChangeText={setText}
                  style={styles.textinput}
                />
                <Button icon="plus" mode="contained" onPress={handleAddItem}>
                  Add
                </Button>
            </View>
              <List.Section>
                {items.map((item, index) => (
                  <List.Item
                    key={index}
                    title={item}
                    right={() => (
                      <IconButton
                        icon="delete"
                        onPress={() => handleDeleteItem(index)}
                      />
                    )}
                  />
                ))}
              </List.Section>
            </View>

            <Text style={styles.addDishes}>Set location on map</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              onPress={handleMapPress}
            >
              <Marker coordinate={{ latitude, longitude }} />
            </MapView>
            <View style={styles.coordsContainer}>
              <Text style={styles.coordsText}>Latitude: {latitude.toFixed(5)}</Text>
              <Text style={styles.coordsText}>Longitude: {longitude.toFixed(5)}</Text>
            </View>
        </View>
        <Button mode="contained" style={styles.button} onPress={onSubmit}>Add Details</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textinput: {
      flex:1,
      margin: 10,  
  },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height* 0.3,
      marginHorizontal: 10,
    },
    coordsContainer: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#fff',
      padding: 10,
    },
    coordsText: {
      fontSize: 16,
    },
    title: {
      marginVertical: 45,
      color: "rgb(101,37,131)",
      fontSize: 20,
      textAlign: "center",
    },
    button: {
      marginVertical: 10,
    },
    addDishes:{
      fontSize:20,
      color: "rgb(101,37,131)",
      marginLeft:10,
    }
  });