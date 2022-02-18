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
import Intent, {addIntentListener} from './Intent';
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
    const handleIntent = intent => {
      console.log(intent);
      // navigate to details if the intent's action is SEND
      if (intent.action === 'android.intent.action.SEND') {
        if (intent.text) {
          RootNavigation.popToTop();
          RootNavigation.push('Details', {text: intent.text});
        } else if (intent.fileContents) {
          RootNavigation.popToTop();
          RootNavigation.push('Details', {text: intent.fileContents});
        }
      }
    };

    // check for intent on app launch
    Intent.getIntentData()
      .catch(e => {
        console.log(e);
      })
      .then(handleIntent);

    // also add a listener on component mount if the user sends data to the app while the app is already open
    const listener = addIntentListener(handleIntent);

    // remove the listener on component unmount
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
