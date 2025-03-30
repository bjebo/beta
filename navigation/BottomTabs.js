import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ClubScreen from '../screens/ClubScreen';
import AddScreen from '../screens/AddScreen';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import YouScreen from '../screens/YouScreen';
import { View } from 'react-native';


import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';





const Tab = createBottomTabNavigator();

import { AddIcon, ClubIcon, HomeIcon, YouIcon, LeaderBoardIcon } from '../components/myicons.js';

export default function BottomTabs({userId}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'lightgray',
        tabBarLabelStyle: {
          marginTop: 4,
          fontSize: 10,
          fontFamily: 'SFProDisplay-Medium',
          fontWeight: 400,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    width: size * 2,
                    height: 3,
                    backgroundColor: '#E1E356',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
              )}
              <AntDesign name="home" size={size} color={color} />
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      >
        {() => <HomeScreen userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Club"
        component={ClubScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    width: size*2,
                    height: 3,
                    backgroundColor: '#E1E356',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
              )}
              <Ionicons name="people-outline" size={24} color={color} />
            </View>
          ),
          tabBarLabel: 'Club',
        }}
      />
      <Tab.Screen
        name="Add"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    width: size * 2,
                    height: 3,
                    backgroundColor: '#E1E356',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
              )}
              <AntDesign name="camerao" size={24} color={color} />
            </View>
          ),
          tabBarLabel: 'Add',
        }}
      >
        {() => <AddScreen userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="Rank"
        component={LeaderBoardScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    width: size*2,
                    height: 3,
                    backgroundColor: '#E1E356',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
              )}
              <Ionicons name="earth-outline" size={24} color={color} />
            </View>
          ),
          tabBarLabel: 'Rank',
        }}
        
      />
      <Tab.Screen
        name="You"
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View style={{ alignItems: 'center' }}>
              {focused && (
                <View
                  style={{
                    width: size * 2,
                    height: 3,
                    backgroundColor: '#E1E356',
                    marginBottom: 4,
                    borderRadius: 2,
                  }}
                />
              )}
              <MaterialCommunityIcons name="account-outline" size={24} color={color} />
            </View>
          ),
          tabBarLabel: 'You',
        }}
      >
        {props => <YouScreen {...props} userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
