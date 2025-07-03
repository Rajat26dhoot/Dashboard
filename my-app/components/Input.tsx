import { StyleSheet, TextInput, View } from "react-native";
import React from "react";
import { InputProps } from "../types";
import { verticalScale } from "../utils/styling";
import { colors, radius, spacingX } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";

const Input = (props: InputProps) => {
  return (
    <LinearGradient
      colors={["#C96DF0", "#97A2FB"]}
      style={[styles.gradientBorder, props.containerStyle && props.containerStyle]}
    >
      <View style={styles.container}>
        {props.icon && props.icon}
        <TextInput
          style={[styles.input, props.inputStyle && props.inputStyle]}
          placeholderTextColor={colors.neutral400}
          ref={props.inputRef && props.inputRef}
          {...props}
        />
      </View>
    </LinearGradient>
  );
};

export default Input;

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: radius._17,
    padding: 1, // Thin border
  },
  container: {
    flexDirection: "row",
    height: verticalScale(64),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
    gap: spacingX._10,
    backgroundColor: colors.neutral900, 
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: verticalScale(14),
  },
});