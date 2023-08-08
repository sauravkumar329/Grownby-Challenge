import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, RefreshControl, Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import AuthContext from '../auth/context';
import AppText from '../AppComponents/Text';
import colors from '../../config/colors';
import storage from '../auth/storage';
import AppButton from '../AppComponents/Button';
import Screen from '../AppComponents/Screen';


type Farm = {
  displayName: string;
  name: string;
  phone: string;
  farmImage: string | null;
  createdDate: Timestamp;
};

type LoginProps = {
  navigation: StackNavigationProp<any>;
};

const Home: React.FC<LoginProps> = ({ navigation }) => {
  const { user, setuser } = useContext(AuthContext);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchData();
    return () => unsubscribe();
  }, []);

  const handleLogOut = () => {
    setuser(null);
    storage.removeUser();
  };
  const fetchData = () => {
    const db = getFirestore();
    const farmsRef = collection(db, 'farms');
    const unsubscribe = onSnapshot(farmsRef, (querySnapshot) => {
      const farmsData: Farm[] = [];
      querySnapshot.forEach((doc) => {
        const farm = doc.data() as Farm;
        farmsData.push(farm);
      });

      setFarms(farmsData);
      setRefreshing(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <Screen style={{ flex: 1, margin: 20 }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 2 }}>
          <AppText style={{ color: colors.black }}>Welcome {'\n'}{user}</AppText>
        </View>
        <View style={{ flex: 1, alignItems: "flex-end" }}><Pressable onPress={() => handleLogOut()}>
          <AppText style={{ color: colors.danger }}>Logout </AppText>
        </Pressable></View>
      </View>
      <View style={{ flex: 1 }}>
        <AppButton title={"ADD FARM"} onPress={() => navigation.navigate('AddFarm')} />
      </View>
      <View style={{ flex: 8 }}>
        <AppText style={{ color: colors.primary, fontWeight: "bold", alignSelf: "center" }}> List of Farms</AppText>
        <FlatList
          data={farms}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={[styles.farmContainer, { flex: 1, flexDirection: "row" }]}>
              <View style={{ flex: 1 }}>
                {item.farmImage && <Image source={{ uri: item.farmImage }} style={styles.farmImage} />}
              </View>
              <View style={{ flex: 3, marginLeft: 5 }}>
                <AppText style={{ color: colors.black, fontWeight: "bold" }}>{item.displayName} </AppText>
                <AppText style={{ color: colors.black, fontSize: 16 }}>{item.phone} </AppText>
                <AppText style={{ color: colors.black, fontSize: 12 }}>{item.createdDate?.toDate().toString()} </AppText>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  farmContainer: {
    margin: 10,
    padding: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  farmImage: {
    // width: "100%",
    height: "100%",
  },
});

export default Home;
