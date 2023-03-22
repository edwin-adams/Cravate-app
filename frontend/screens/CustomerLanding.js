import { StatusBar } from 'expo-status-bar';
import { useState , component} from 'react';
import {KeyboardAvoidingView, ScrollView,StyleSheet, Text, TouchableOpacity, View,TextInput,Button,FlatList,SafeAreaView  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

export default function CustomerLanding({navigation}) {

    const Task = (props) => {
        //Task starts
        const handlePress = () => {
          navigation.navigate('OtherScreen', { taskText: props.text });
          console.log('Navigated to OtherScreen with taskText:', props.text);
        };
      
        return (
          <TouchableOpacity onPress={handlePress}>
          <View style={styles2.item}>
            <View style={styles2.itemLeft}>
              <View style={styles2.square}></View>
              <Text style={styles2.itemText}>{props.text}</Text>
            </View>
            <View style={styles2.circular}></View>
          </View>
          </TouchableOpacity>
        )
      }
    
    const [task,setTask] = useState();

    //store the foodtruck 
  
    const handleAddTask = ()=>{
    console.log(task);
    }
    
    return (
        <View style={styles.container}>
        {/* This is the homepage Showing cusines  */}

        <ScrollView>
            <View style = {styles.textsWrapper}>
                <Text style={styles.sectionTitle}>Cuisines we have for you!!</Text>

                <View style = {styles.items}>
                {/* This is where the cuisines will go*/}
            
                    <Task text = {'Indian'}></Task>
                    <Task text = {'Thai'}/>
                    <Task text = {'Chineese'}/>
                    <Task text = {'Korean'}/>
                </View>
            </View>
         </ScrollView>


         <ScrollView>
            <View style = {styles.textsWrapper}>
                <Text style={styles.sectionTitle}>Popular Food Trucks!!</Text>

                <View style = {styles.items}>
                {/* This is where the cuisines will go*/}
          
                    <Task text = {'Tasty Truck'}></Task>
                    <Task text = {'Meat Wagon'}/>
                    <Task text = {'Hangry Hot Dogs'}/>
                </View>
            </View>
         </ScrollView>

         
        {/* Search section */}
        {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.writeTaskWrapper}
        >
        <TextInput style={styles.input} placeholder={'Search for your favourite here'} value={task} onChangeText = {text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View> 
    );
}

const styles = StyleSheet.create({

    box: {
      padding: 10,
      backgroundColor: 'gray',
      borderWidth: 1,
      borderColor: 'black',
      textAlign: 'center',
    },
  
  
    user: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'pink',
    },
    partner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'yellow',
    },
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
      
    },
  
    tasksWrapper: {
      paddingTop: 70,
      paddingHorizontal:20
  
    },
    sectionTitle:{
      fontSize: 24,
      fontWeight: 'bold'
  
    },
    items: {},
    writeTaskWrapper: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
    },
    input: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: '#FFF',
      borderRadius: 60,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 250,
    },
    addWrapper: {
      width: 60,
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#C0C0C0',
      borderWidth: 1,
    },
    addText: {},
    foodtruck: {fontSize: 24,
      fontWeight: 'bold',
      marginTop: 50,
    }
  });

  const styles2 = StyleSheet.create({
    item: {
      backgroundColor: '#FFF',
      padding: 15,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    square: {
      width: 24,
      height: 24,
      backgroundColor: '#55BCF6',
      opacity: 0.4,
      borderRadius: 5,
      marginRight: 15,
    },
    itemText: {
      maxWidth: '80%',
    },
    circular: {
      width: 12,
      height: 12,
      borderColor: '#55BCF6',
      borderWidth: 2,
      borderRadius: 5,
    },
  });
  
  