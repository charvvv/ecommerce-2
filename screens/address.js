import { View, Text, ScrollView, TextInput, Pressable, Alert } from 'react-native'
import React, {useEffect, useState, useContext} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
//import {UserType} from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const address = () => {
  const navigation = useNavigation(); 
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pinCode, setPinCode] = useState("");
  const{userId, setUserId} = useContext(userType);
  useEffect(()=>{
    const fetchUser = async()=>{
      const token = await AsyncStorage.getItem("auth token");
      const decodedToken = jwt_decode(token)
      const userId = decodedToken.userId;
      setUserId(userId)
    }
    fetchUser();

  }, []);
  
  console.log(userId);
  const handleAddresses = ()=>{
    const address = {name, mobileNumber, houseNumber, street, landmark, pinCode}
    axios.post("hhttps://ecommercebackend-2xn3.onrender.com/addresses", {userId, address}).then((response)=>{
      Alert.alert("success", "address added successfully");
      setName("");
      setMobileNumber("");
      setHouseNumber("");
      setStreet("");
      setLandmark("");
      setPinCode("");
      setTimeout(()=>{navigation.goBack()}, 500);
      
    })
    .catch((error)=>{
      Alert.alert("error", "failed add address");
      console.log("error", error)
    })
  }
  return (
    <ScrollView style={{marginTop: 50}}>
      <View style={{height: 50, backgroundColor: "#00CED1"}}>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 17, fontWeight: "bold"}}>Add a new Address</Text>
          <TextInput placeholderTextColor={"black"}
          placeholder='USA' style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, marginTop: 10, borderRadius: 5}}/>
          <View style={{marginVertical: 10}}>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>Full Name (first and last name)</Text>
            <TextInput value={"name"} placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}} placeholder="Enter Your Name" />
          </View>
          <View>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>Mobile Number</Text>
            <TextInput value='mobileNumber' placeholder='Mobile Number' placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}}/>
          </View>
          <View style={{marginVertical: 10}}>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>Flat, House Number, Building</Text>
            <TextInput value='houseNumber' placeholder='' placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}}/>
          </View>
          <View>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>Area, Street, Sector, Village</Text>
            <TextInput value='street' placeholder='' placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}}/>
          </View>
          <View>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>Landmark</Text>
            <TextInput value='landmark' placeholder='Example: near xyz street' placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}}/>
          </View>
          <View>
            <Text style={{fontSize: 15, fontWeight: "bold"}}>PIN Code</Text>
            <TextInput value='pinCode' placeholder='Enter PIN Code' placeholderTextColor={"black"} style={{padding: 10, borderColor: "#D0D0D0", borderWidth: 1, borderRadius: 5, marginTop: 10}}/>
          </View>
          <Pressable onPress={handleAddresses} style={{backgroundColor: "#FFC72C", padding: 20, borderRadius: 6, justifyContent: "center", alignItems: "center", marginTop: 10}}>
            <Text style={{fontWeight: "bold"}}>Add Address</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

export default address