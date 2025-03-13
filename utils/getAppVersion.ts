import Constants from 'expo-constants';

export default function getAppVersion() {
  return Constants.expoConfig?.version || '1.0.0';
}
