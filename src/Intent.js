import {NativeEventEmitter, NativeModules} from 'react-native';

const module = NativeModules.IntentNavModule;

const addListener = eventHandler => {
  const emitter = new NativeEventEmitter(module);
  const listener = emitter.addListener('onNewIntent', eventHandler);
  return listener.remove;
};

module.addListener = addListener;
export default module;
