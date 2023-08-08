import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../../config/styles";

interface AppTextInputProps extends TextInputProps {
  icon?: string;
  width?: string | number;
}

function AppTextInput({ icon, width = "100%", ...otherProps }: AppTextInputProps) {
  return (
    <View style={[styles.container, { width }]}>

      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={[defaultStyles.text, {width:"100%"}]}
        {...otherProps}
      />

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
