import React from "react";
import { Animated, StyleSheet, TouchableOpacity, Platform, View } from "react-native";
import { CurvedBottomBarExpo } from "react-native-curved-bottom-bar";
import * as Icons from "phosphor-react-native";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';

// Import your screensn
import DashboardScreen from "@/app/(screens)/DashboardScreen";
import TransactionListScreen from "@/app/(screens)/TransactionListScreen";
import AddPaymentScreen from "@/app/(screens)/AddPaymentScreen";
import TransactionDetailsScreen from "@/app/(screens)/TransactionDetailsScreen";

// Gradient colors
const gradientColors = ['#C96DF0', '#97A2FB'];

const GradientIconMask = ({ children }) => (
  <MaskedView maskElement={<>{children}</>}>
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{
        width: verticalScale(36),
        height: verticalScale(36),
      }}
    />
  </MaskedView>
);

// For tab icons
const tabIcons = {
  index: (isFocused) =>
    isFocused ? (
      <GradientIconMask>
        <Icons.House size={verticalScale(30)} weight="fill" color="#fff" />
      </GradientIconMask>
    ) : (
      <Icons.House
        size={verticalScale(30)}
        weight="regular"
        color={colors.neutral400}
      />
    ),
  statistics: (isFocused) =>
    isFocused ? (
      <GradientIconMask>
        <Icons.ChartBar size={verticalScale(30)} weight="fill" color="#fff" />
      </GradientIconMask>
    ) : (
      <Icons.ChartBar
        size={verticalScale(30)}
        weight="regular"
        color={colors.neutral400}
      />
    ),
  wallet: (isFocused) =>
    isFocused ? (
      <GradientIconMask>
        <Icons.Wallet size={verticalScale(30)} weight="fill" color="#fff" />
      </GradientIconMask>
    ) : (
      <Icons.Wallet
        size={verticalScale(30)}
        weight="regular"
        color={colors.neutral400}
      />
    ),
  profile: (isFocused) =>
    isFocused ? (
      <GradientIconMask>
        <Icons.User size={verticalScale(30)} weight="fill" color="#fff" />
      </GradientIconMask>
    ) : (
      <Icons.User
        size={verticalScale(30)}
        weight="regular"
        color={colors.neutral400}
      />
    ),
};

const CurvedTabsNavigator = () => {
  const router = useRouter();
  const renderTabBar = ({ routeName, selectedTab, navigate }) => (
    <TouchableOpacity
      key={routeName}
      onPress={() => navigate(routeName)}
      style={styles.tabBarItem}
      activeOpacity={0.7}
    >
      {tabIcons[routeName] && tabIcons[routeName](routeName === selectedTab)}
    </TouchableOpacity>
  );

  return (
    <CurvedBottomBarExpo.Navigator
      type="DOWN"
      circlePosition="CENTER"
      style={styles.bottomBar}
      shadowStyle={styles.shadow}
      height={Platform.OS === "ios" ? verticalScale(73) : verticalScale(60)}
      circleWidth={60}
      bgColor={colors.neutral800}
      initialRouteName="index"
      borderTopLeftRight
      // Remove borderColor/borderWidth from here; we'll do gradient border manually
      tabBar={renderTabBar}
      renderCircle={({ selectedTab, navigate }) => (
        // Gradient border circle
        <Animated.View style={styles.btnCircleUpWrapper}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.btnCircleUpInner}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  
                }}
                activeOpacity={0.7}
              >
                {/* Gradient-filled add icon */}
                <GradientIconMask>
                  <Ionicons name="add" size={36} color="#fff" />
                </GradientIconMask>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}
    >
      <CurvedBottomBarExpo.Screen
        name="index"
        position="LEFT"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBarExpo.Screen
        name="statistics"
        position="LEFT"
        component={TransactionListScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBarExpo.Screen
        name="wallet"
        position="RIGHT"
        component={AddPaymentScreen}
        options={{ headerShown: false }}
      />
      <CurvedBottomBarExpo.Screen
        name="profile"
        position="RIGHT"
        component={TransactionDetailsScreen}
        options={{ headerShown: false }}
      />
    </CurvedBottomBarExpo.Navigator>
  );
};

const BORDER_WIDTH = 3; // Thickness of gradient border

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomBar: {},
  btnCircleUpWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
  gradientBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCircleUpInner: {
    width: 60 - 2 * BORDER_WIDTH,
    height: 60 - 2 * BORDER_WIDTH,
    borderRadius: (60 - 2 * BORDER_WIDTH) / 2,
    backgroundColor: colors.neutral800,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
  },
});

export default CurvedTabsNavigator;