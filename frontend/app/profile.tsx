import { Redirect } from 'expo-router';

/** Legacy stack route — profile lives on the Account tab. */
export default function ProfileRedirect() {
  return <Redirect href="/(tabs)/profile" />;
}
