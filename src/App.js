/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {addIntentListener} from './Intent';
import * as RootNavigation from './RootNavigation';

enableScreens();
const Stack = createNativeStackNavigator();

const Screen2 = ({route}) => {
  return (
    <View style={styles.container}>
      <Text>{route?.params?.text ?? 'No data from intent!'}</Text>
    </View>
  );
};

const Screen1 = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Button
        title="Next Screen"
        onPress={() => {
          navigation.push('Details');
        }}
      />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    const listener = addIntentListener(event => {
      console.log(event);
      if (event.action === 'android.intent.action.SEND') {
        if (event.text) {
          RootNavigation.popToTop();
          RootNavigation.push('Details', {text: event.text});
        } else if (event.fileContents) {
          RootNavigation.popToTop();
          RootNavigation.push('Details', {text: event.fileContents});
        }
      }
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <NavigationContainer ref={RootNavigation.navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Screen1} />
        <Stack.Screen name="Details" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default App;
