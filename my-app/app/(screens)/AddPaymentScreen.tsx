import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { colors } from '@/constants/theme';
import * as Icons from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export type PaymentStatus = 'success' | 'failed' | 'pending';
export type PaymentMethod = 'upi' | 'card' | 'bank' | 'cash';

export default function AddPaymentScreen() {
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

  const [statusItems, setStatusItems] = useState([
    {
      label: 'Success',
      value: 'success',
      icon: () => <Icons.CheckCircle size={22} color="lime" weight="duotone" />,
    },
    {
      label: 'Failed',
      value: 'failed',
      icon: () => <Icons.XCircle size={22} color="red" weight="duotone" />,
    },
    {
      label: 'Pending',
      value: 'pending',
      icon: () => (
        <Icons.ClockAfternoon size={22} color="orange" weight="duotone" />
      ),
    },
  ]);

  const [methodItems, setMethodItems] = useState([
    {
      label: 'UPI',
      value: 'upi',
      icon: () => <Icons.Wallet size={22} color="#00ffcc" weight="duotone" />,
    },
    {
      label: 'Card',
      value: 'card',
      icon: () => <Icons.CreditCard size={22} color="#66f" weight="duotone" />,
    },
    {
      label: 'Bank',
      value: 'bank',
      icon: () => <Icons.Bank size={22} color="#0ff" weight="duotone" />,
    },
    {
      label: 'Cash',
      value: 'cash',
      icon: () => <Icons.Money size={22} color="#0f0" weight="duotone" />,
    },
  ]);

  const handleSubmit = async () => {
    if (!amount || !receiver || !status || !method) {
      Alert.alert('Validation Error', 'Please fill all fields correctly.');
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) throw new Error('Access token not found');

      await axios.post(
        'http://192.168.29.184:3000/payments',
        {
          amount: Number(amount),
          receiver,
          status,
          method,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Payment added successfully');
      setAmount('');
      setReceiver('');
      setStatus(null);
      setMethod(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

return (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>Add Payment</Text>

        {/* Amount Input */}
        <View style={styles.inputWrapper}>
          <Icons.CurrencyDollarSimple
            size={verticalScale(26)}
            color={colors.white}
            weight="fill"
            style={styles.icon}
          />
          <TextInput
            placeholder="Amount"
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputSpacer} />

        {/* Receiver Input */}
        <View style={styles.inputWrapper}>
          <Icons.User
            size={verticalScale(26)}
            color={colors.white}
            weight="fill"
            style={styles.icon}
          />
          <TextInput
            placeholder="Receiver"
            placeholderTextColor="#aaa"
            value={receiver}
            onChangeText={setReceiver}
            style={styles.input}
          />
        </View>

        {/* Payment Status Dropdown */}
        <Text style={styles.label}>Payment Status</Text>
        <DropDownPicker
          open={statusOpen}
          value={status}
          items={statusItems}
          setOpen={setStatusOpen}
          setValue={setStatus}
          setItems={setStatusItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholder="Select Status"
          placeholderStyle={styles.dropdownText}
          zIndex={3000}
          zIndexInverse={1000}
          listItemLabelStyle={styles.dropdownText}
          ArrowDownIconComponent={() => (
            <Icons.CaretDown size={20} color="white" weight="bold" />
          )}
          ArrowUpIconComponent={() => (
            <Icons.CaretUp size={20} color="white" weight="bold" />
          )}
          renderListItemLabel={({ label, icon }) => (
            <View style={styles.dropdownIconRow}>
              {icon}
              <Text style={styles.dropdownText}>{label}</Text>
            </View>
          )}
        />

        {/* Payment Method Dropdown */}
        <Text style={styles.label}>Payment Method</Text>
        <DropDownPicker
          open={methodOpen}
          value={method}
          items={methodItems}
          setOpen={setMethodOpen}
          setValue={setMethod}
          setItems={setMethodItems}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholder="Select Method"
          placeholderStyle={styles.dropdownText}
          zIndex={2000}
          zIndexInverse={2000}
          listItemLabelStyle={styles.dropdownText}
          ArrowDownIconComponent={() => (
            <Icons.CaretDown size={20} color="white" weight="bold" />
          )}
          ArrowUpIconComponent={() => (
            <Icons.CaretUp size={20} color="white" weight="bold" />
          )}
          renderListItemLabel={({ label, icon }) => (
            <View style={styles.dropdownIconRow}>
              {icon}
              <Text style={styles.dropdownText}>{label}</Text>
            </View>
          )}
        />

        <View style={{ marginTop: 20 }}>
          <Button onPress={handleSubmit} disabled={loading}>
            <Typo fontWeight="700" color={colors.black} size={21}>
              {loading ? 'Submitting...' : 'Add Payment'}
            </Typo>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  heading: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#ccc',
    marginTop: 16,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderColor: colors.darkblue,
    height: 50,
  },
  dropdownContainer: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  dropdownText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderColor: colors.darkblue,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
  inputSpacer: {
    height: 12,
  },
});
