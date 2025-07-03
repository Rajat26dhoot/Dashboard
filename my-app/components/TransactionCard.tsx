// src/components/TransactionCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export const TransactionCard = ({ transaction }: any) => {
  return (
    <View style={styles.card}>
      <Text>ID: {transaction.id}</Text>
      <Text>Amount: ${transaction.amount}</Text>
      <Text>Receiver: {transaction.receiver}</Text>
      <Text>Status: {transaction.status}</Text>
      <Text>Payment Method: {transaction.method}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 10, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 5 },
});
