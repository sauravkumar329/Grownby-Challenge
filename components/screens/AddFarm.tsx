import React, { useContext, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AuthContext from '../auth/context';
import AppText from '../AppComponents/Text';
import colors from '../../config/colors';
import { Formik } from "formik";
import * as Yup from 'yup';
import AppTextInput from '../AppComponents/TextInput';
import AppButton from '../AppComponents/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ImageInput from '../AppComponents/ImageInput';
import Screen from '../AppComponents/Screen';

type AddFarmProps = {
  navigation: StackNavigationProp<any>;
};

const AddFarm: React.FC<AddFarmProps> = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddFarm = async (values: { displayName: string, name: string, phone: string }) => {
    setLoading(true);

    const db = getFirestore();
    const farmRef = doc(db, 'farms', values.name);
    let imageURL = '';
    if (image) {
      const storageRef = ref(getStorage(), 'images/' + image.split('/').pop());
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      imageURL = await getDownloadURL(storageRef);
    }

    const farmSnap = await getDoc(farmRef);

    try {
      if (!farmSnap.exists()) {
        await setDoc(farmRef, {
          name: values.name,
          displayName: values.displayName,
          phone: values.phone,
          farmImage: imageURL
        });
        navigation.goBack()
      } else {
        alert('Farm name already exists!');
      }
    } catch (error) {
      alert('Error adding farm: ' + error);
      console.log(error)
      setLoading(false);
    }

    setLoading(false);

  };

  const validationSchema = Yup.object().shape({
    displayName: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    phone: Yup.string().matches(/^[0-9]+$/, 'Invalid phone number'),
  });

  return (
    <>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <Screen style={{ flex: 1, margin: 20 }}>
            <View style={styles.container}>
              <AppText style={{ color: colors.black }}>Welcome {'\n'}{authContext.user}</AppText>
              <Formik
                initialValues={{ displayName: '', name: '', phone: '', }}
                onSubmit={handleAddFarm}
                validationSchema={validationSchema}
              >
                {({ handleChange, handleSubmit, errors }) => (
                  <>
                    <AppTextInput icon={"store"} placeholder={"Enter Display Name of the Farm"} onChangeText={handleChange("displayName")} />
                    <AppText style={{ "color": colors.danger }}>{errors.displayName}</AppText>
                    <AppTextInput icon={"store"} placeholder={"Enter Name of the Farm"} onChangeText={handleChange("name")} />
                    <AppText style={{ "color": colors.danger }}>{errors.name}</AppText>
                    <AppTextInput icon={"phone"} inputMode="numeric" placeholder={"Enter Phone of the Farm"} onChangeText={handleChange("phone")} />
                    <AppText style={{ "color": colors.danger }}>{errors.phone}</AppText>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <ImageInput imageUri={image} onChangeImage={setImage} />
                    </View>
                    <AppButton title="ADD FARM" onPress={handleSubmit} />
                    <AppButton title="BACK" color='danger' onPress={() => navigation.goBack()} />

                  </>
                )}
              </Formik>
            </View>
          </Screen>
        </>
      )}

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AddFarm;
