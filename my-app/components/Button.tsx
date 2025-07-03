import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { CustomButtonProps } from "../types";
import { colors, radius } from "../constants/theme";
import { verticalScale } from "../utils/styling";
import Loading from "./Loading";
import { LinearGradient } from 'expo-linear-gradient';



const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.button, style, { backgroundColor: "transparent" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress}>
       <LinearGradient 
        colors={['#C96DF0', '#97A2FB']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.button, style]}
      >
      {children}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
});