import { View, StyleSheet, Dimensions,Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AppText from '../../AppComponents/Text';
import AppTextInput from '../../AppComponents/TextInput';
import AppButton from '../../AppComponents/Button';
import { Formik } from "formik";
import * as Yup from 'yup';
import colors from '../../../config/colors';
import { auth } from '../../../config/firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { useContext, useState } from 'react';
import AuthContext from '../../auth/context';
import authStorage from '../../auth/storage';
import Screen from '../../AppComponents/Screen';
type LoginProps = {
    navigation: StackNavigationProp<any>;
};

const { width } = Dimensions.get('window');

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const authContext = useContext(AuthContext)
    const [iserror, setIsError] = useState<boolean>(false);
    const [errorMsg, seterrorMsg] = useState('');
    const validationSchema = Yup.object().shape({
        email: Yup.string().required().email().label("Email"),
        password: Yup.string().required().min(4).label("Password"),
    });

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            setIsError(false)
            const result: UserCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            authContext.setuser(result.user.email)
            authStorage.storeUser(result.user.email)

        } catch (error: any) {
            let errorMessage: string;
            setIsError(true)
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This user has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                default:
                    errorMessage = 'An unknown error occurred. Please try again later.';

                    break;
            }
            seterrorMsg(errorMessage)
        }
    };

    return (
        <Screen style={{flex:1, margin:10}}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require("../../../assets/logo_white.png")} />
              </View>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={handleLogin}
                validationSchema={validationSchema}
            >
                {
                    ({ handleChange, handleSubmit, errors }) => (
                        <>
                            <AppTextInput icon={"email"} placeholder={"Enter your Email"} onChangeText={handleChange("email")} />
                            <AppText style={{ "color": colors.danger }}>{errors.email}</AppText>
                            <AppTextInput icon={"key"} placeholder={"Your Password"} onChangeText={handleChange("password")} secureTextEntry={true} />
                            <AppText style={{ "color": colors.danger }}>{errors.password}</AppText>
                            <AppButton title="Login" onPress={handleSubmit} />
                            {iserror && <AppText style={{ color: colors.danger }}>
                                {errorMsg}
                            </AppText>}
                        </>
                    )
                }
            </Formik>
        </Screen>
    );
};

const styles = StyleSheet.create({

    logoContainer: {
        backgroundColor: colors.primary,
        paddingHorizontal:10,
        maxHeight: 100,
        height:50,
        width: width > 800 ? width  / 6 : width/2,
        alignSelf: "center",
        borderRadius: 10,
      },
      logo: {
        width: "100%",
        height: 50,
        resizeMode: "contain",
      }
});

export default Login;
