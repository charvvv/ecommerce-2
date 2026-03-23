import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, ViewComponent } from 'react-native';
import React, { userLayoutEffect, useEffect, useContext, useState, useLayoutEffect} from "react";
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType } from '../userContext';
import { jwtDecode } from 'jwt-decode';


const profile = () => {
  const {userId, setUserId } = useContext(UserType);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation =  useNavigation();
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitle: "", headerStyle: {backgroundColor: "#00CED1"}, 
      headerLeft: ()=>(
        <Image style={{height: 120, width: 140, resizeMode: "contain"}} source={{uri: "https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c518.png"}}/>

      ),
      headerRight: ()=>(
        <View style={{flexDirection: "row", alignItems: "center", gap: 6, marginRight: 12}}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <AntDesign name="search1" size= {24} color="black"/>
        </View>
      )

    })
  })
  
const [user, setUser] = useState();
useEffect(()=>{
  const loadUser = async()=>{
    try {
      if (!userId){
        const token = await AsyncStorage.getItem("authtoken");
        if (token){
          const decode = jwtDecode(token);
          setUserId(decode.userId);

        }
      }
    }
    catch (error) {
      console.log("error loading user id", error)
    }
  };
  loadUser();


}, []);

useEffect(()=>{
  const fetchUserProfile = async()=>{
    try {
      const response = await axios.get(
        `https://ecommercebackend-2xn3.onrender.com/profile/${userId}`
      );
      const {user} = response.data;
      setUser(user);


    }
    catch(error){
      console.log("error", error);
    }
  };
  fetchUserProfile();
},[]);
const logout = ()=>{
  clearAuthToken();
};
const clearAuthToken = async()=>{
  await AsyncStorage.removeItem("authToken");
  console.log("auth token cleared");
  navigation.replace("loginScreen");
};
useEffect(()=>{
  const fetchOrders = async()=>{
    try{const response = await axios.get(`https://ecommercebackend-2xn3.onrender.com/orders/${userId}`);
    const orders = response.data.orders;
    setOrders(orders);
    setLoading(false);

}
catch(error){console.log("error", error);}
  };
  fetchOrders();
}, []);

console.log("orders", orders);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your orders or profile"
            placeholderTextColor="#888"
          />
        </View>

        
        <View style={styles.header}>
          {/*<Image
            style={styles.profileImage}
            source={{ uri: user.profileImage }}
          />*/}
          <View style={[styles.profileImage, {backgroundColor: 'beige', justifyContent: 'center', alignItems: 'center'}]}>
            <Text style={{fontSize: 48, fontWeight: 'bold', color: 'black'}}>{user?.name?.charAt(0).tooUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.username}>{user?.email}</Text>
        </View>

        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Current Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Past Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton}>
            <Text style={styles.orderButtonText}>Buy It Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.orderButton} onPress={logout}>
            <Text style={styles.orderButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      
        <ScrollView horizontal showsHorizontalScrollIndicator = {false}>
          {loading?(
            <Text>Loading</Text>

          ): orders.length > 0?(
            orders.map((order)=>(
              <TouchableOpacity style={{marginTop: 20, padding: 50, bordrRadius: 10, borderWidth: 1, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}} 
              key={order._id}>
                {order.product.slice(0, 1)?.map((product)=>(
                  <View style={{marginVertical: 10}} key={product._id}>
                    <Image source={{uri: product.image}} style={{widith: 100, height: 100, resizeMode: "contain"}}/>
                  </View>
                ))}
              </TouchableOpacity>
            ))
          ):(
            <Text>No orders found</Text>
          )}
        </ScrollView>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>location: {user?.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>date {user?.joinDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />
        

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f4',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0eee8',
    borderRadius: 25,
    paddingHorizontal: 20, 
    paddingVertical: 10,
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#386641',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#c2e5c7',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#386641',
  },
  username: {
    fontSize: 16,
    color: '#578c63',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  orderButton: {
    backgroundColor: '#c2e5c7',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#386641',
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#497452',
  },
  divider: {
    height: 1,
    backgroundColor: '#c2e5c7',
    width: '100%',
    marginBottom: 20,
  },
  placeholderContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e0eee8',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#578c63',
    textAlign: 'center',
  },
});

export default profile;