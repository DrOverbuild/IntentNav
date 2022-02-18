import {NativeEventEmitter, NativeModules} from 'react-native';

const module = NativeModules.IntentNavModule;

const emitter = new NativeEventEmitter(module);

export const addIntentListener = listener => {
  return emitter.addListener('onNewIntent', listener);
};

export default module;
