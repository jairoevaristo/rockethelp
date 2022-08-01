import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

import { SignIn } from "../screens/SignIn";
import { AppRoutes } from "./app.route";

import { Loading } from "../components/Loading";

export function Routes() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(response => {
      setUser(response);
      setLoading(false);
    });

    return subscriber;
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  )
}