import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import AddFarm from "../screens/AddFarm";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
       <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="AddFarm"
        component={AddFarm}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;