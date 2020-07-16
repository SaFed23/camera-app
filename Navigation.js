import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Camera from './Camera';

const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
            <Stack.Screen name={"Camera"} component={Camera}/>
        </Stack.Navigator>
    )
}
