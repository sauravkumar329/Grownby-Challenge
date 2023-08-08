import React from "react";
import Constants from "expo-constants";

import { View, StyleSheet, Dimensions } from "react-native";



const { width } = Dimensions.get('window');
function Screen({ children, style }) {
    const containerStyle = width > 800 ? styles.containerWeb : styles.containerMobile;
    return (
        <View style={[containerStyle, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    containerWeb: {
        width: '50%',
        maxWidth: 400,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    containerMobile: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
    },
});

export default Screen;