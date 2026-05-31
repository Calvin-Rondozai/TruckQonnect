import { Redirect } from 'expo-router';

/** Launch: splash → onboarding → welcome → role → login → otp → shipper or owner app */
export default function Index() {
  return <Redirect href="/splash" />;
}
