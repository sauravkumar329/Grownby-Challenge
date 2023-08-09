import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AppText from '../../AppComponents/Text';
import AppTextInput from '../../AppComponents/TextInput';
import AppButton from '../../AppComponents/Button';
import { Formik } from "formik";
import * as Yup from 'yup';
import colors from '../../../config/colors';
import { auth } from '../../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Screen from '../../AppComponents/Screen';
import { useState } from 'react';

type SignupProps = {
  navigation: StackNavigationProp<any>;
};

const { width } = Dimensions.get('window');

const Signup: React.FC<SignupProps> = ({ navigation }) => {
    
    const [iserror, setIsError] = useState<boolean>(false);
    const [errorMsg, seterrorMsg] = useState('');
  const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').label("Confirm Password"),
  });

  const handleSignup = async (values: { email: string; password: string }) => {
    setIsError(false)
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      navigation.navigate("Login")

      
    } catch (error: any) {
        console.log(error)
        setIsError(true)
      let errorMessage: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Signup not allowed.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password too weak.';
          break;
        default:
          errorMessage = 'An unknown error occurred. Please try again later.';
          break;
      }
      seterrorMsg(errorMessage)
    }
  };

  return (
    <Screen style={{ flex: 1, margin: 10 }}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../../../assets/logo_white.png")} />
      </View>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        onSubmit={handleSignup}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleSubmit, errors }) => (
          <>
            <AppTextInput icon={"email"} placeholder={"Enter your Email"} onChangeText={handleChange("email")} />
            <AppText style={{ "color": colors.danger }}>{errors.email}</AppText>
            <AppTextInput icon={"key"} placeholder={"Your Password"} onChangeText={handleChange("password")} secureTextEntry={true} />
            <AppText style={{ "color": colors.danger }}>{errors.password}</AppText>
            <AppTextInput icon={"key"} placeholder={"Confirm Password"} onChangeText={handleChange("confirmPassword")} secureTextEntry={true} />
            <AppText style={{ "color": colors.danger }}>{errors.confirmPassword}</AppText>
            {iserror && <AppText style={{ color: colors.danger }}>
                                {errorMsg}
                            </AppText>}
            <AppButton title="Signup" onPress={handleSubmit} />
            <AppButton title="BACK TO Login" onPress={()=>navigation.navigate("Login")} />
            
          </>
        )}
      </Formik>
     
    </Screen>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    maxHeight: 100,
    height: 50,
    width: width > 800 ? width / 6 : width / 2,
    alignSelf: "center",
    borderRadius: 10,
  },
  logo: {
    width: "100%",
    height: 50,
    resizeMode: "contain",
  }
});

export default Signup;
