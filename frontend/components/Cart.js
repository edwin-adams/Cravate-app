import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    Pressable,
  } from "react-native";
  import React, { useState, useEffect} from "react";

 









  const images = [
    {
      id: "0",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqg_OBzcVDnKHv1d3hyVk_WlCo43pzit4CJQ&usqp=CAU",
      name: "icecream",
    },
    {
      id: "1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT85O96gPiso_j2gaS0cePTBY4mCR3pumV6tw&usqp=CAU",
      name: "biscuit",
    },
    {
      id: "2",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSicQWeRoxxLEr1RLIp8dJtw-NQvSE4xtlhwA&usqp=CAU",
      name: "chocolate",
    },
  ];
  
  const Cart = () => {
    const [cart,setCart] = useState([]);
    console.log("cart items",cart)
    return (
      <>
        <Text style={{ textAlign: "center", fontSize: 20 }}>
          Dishes
        </Text>
        {images.map((item) => (
          <Pressable
            key={item.id}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View style={{ margin: 10 }}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 8 }}
                source={{ uri: item.image }}
              />
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              {cart.includes(item) ? (
                 <Pressable onPress={() => setCart(cart.filter((x) => x.id !== item.id))}>
                 <Text
                   style={{
                     borderColor: "gray",
                     borderWidth: 1,
                     marginVertical: 10,
                     padding: 5,
                   }}
                 >
                 Unavailable
                 </Text>
               </Pressable>
              ):(
                <Pressable onPress={() => setCart([...cart,item])}>
                <Text
                  style={{
                    borderColor: "gray",
                    borderWidth: 1,
                    marginVertical: 10,
                    padding: 5,
                  }}
                >
                  Available
                </Text>
              </Pressable>
              )}
             
            </View>
          </Pressable>
        ))}
      
        
      </>
    );
  };
  
  export default Cart;
  
  const styles = StyleSheet.create({});