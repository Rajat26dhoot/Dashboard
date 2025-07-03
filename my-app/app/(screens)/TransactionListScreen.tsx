import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import * as Icons from 'phosphor-react-native';

type PaymentStatus = 'success' | 'failed' | 'pending';
type PaymentMethod = 'upi' | 'card' | 'bank' | 'cash';

interface Payment {
  id: number;
  amount: string;
  receiver: string;
  status: PaymentStatus;
  method: PaymentMethod;
  createdAt: string;
}

export default function TransactionListScreen() {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('');
  const [hasMore, setHasMore] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const router = useRouter();

  const LIMIT = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const params: any = { page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      if (methodFilter) params.method = methodFilter;

      const res = await axios.get('http://192.168.29.184:3000/payments', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setTransactions(res.data);
      setHasMore(res.data.length === LIMIT);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [page, statusFilter, methodFilter])
  );

  const handleCardPress = (id: number) => {
    router.push(`/payment/${id}`);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'success':
        return '#00ffcc';
      case 'failed':
        return '#ff6b6b';
      case 'pending':
        return '#f0ad4e';
    }
  };

 

  const renderItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity onPress={() => handleCardPress(item.id)} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.receiver}>{item.receiver}</Text>
          <Text
            style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.amount}>₹{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Transactions</Text>

      {/* Filters */}
      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={statusOpen}
          value={statusFilter}
          items={[
            { label: 'All Status', value: '' },
            { label: 'Success', value: 'success' },
            { label: 'Pending', value: 'pending' },
            { label: 'Failed', value: 'failed' },
          ]}
          setOpen={setStatusOpen}
          setValue={setStatusFilter}
          placeholder="Select Status"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownText}
          ArrowDownIconComponent={() => <Icons.CaretDown size={20} color="#fff" />}
          ArrowUpIconComponent={() => (
            <Icons.CaretDown size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
          )}
        />
      </View>

      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={methodOpen}
          value={methodFilter}
          items={[
            { label: 'All Methods', value: '' },
            { label: 'UPI', value: 'upi' },
            { label: 'Card', value: 'card' },
            { label: 'Bank', value: 'bank' },
            { label: 'Cash', value: 'cash' },
          ]}
          setOpen={setMethodOpen}
          setValue={setMethodFilter}
          placeholder="Select Method"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.placeholderStyle}
          listItemLabelStyle={styles.dropdownText}
          ArrowDownIconComponent={() => <Icons.CaretDown size={20} color="#fff" />}
          ArrowUpIconComponent={() => (
            <Icons.CaretDown size={20} color="#fff" style={{ transform: [{ rotate: '180deg' }] }} />
          )}
        />
      </View>

      {/* Pagination */}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage((p) => Math.max(p - 1, 1))}
          style={[styles.pageButton, page === 1 && { opacity: 0.4 }]}
          disabled={page === 1}
        >
          <Text style={styles.pageButtonText}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>Page {page}</Text>
        <TouchableOpacity
          onPress={() => setPage((p) => p + 1)}
          style={[styles.pageButton, !hasMore && { opacity: 0.4 }]}
          disabled={!hasMore}
        >
          <Text style={styles.pageButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderColor: colors.darkblue,
    marginBottom: 12,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  placeholderStyle: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: '#1e1e1e',
    borderColor: colors.darkblue,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  cardLeft: {
    flex: 1,
  },
  receiver: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffcc',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  pageButtonText: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  pageNumber: {
    color: '#fff',
    fontSize: 16,
  },
});
