import { View, TextInput, FlatList, Modal, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState ,useEffect} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Typo from '@/components/Typo';
import { handleLogout } from '@/app/LoginScreen';
import { colors } from '@/constants/theme';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import * as Icons from 'phosphor-react-native';
import { Picker } from '@react-native-picker/picker';
import { jwtDecode } from "jwt-decode"

export default function ProfileScreen() {
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({ username: '', password: '', role: 'viewer' });
  const [username, setUsername] = useState('');

  useEffect(() => {
  const getUsernameFromToken = async () => {
    const token = await SecureStore.getItemAsync('access_token');
        console.log(token);

    if (!token) return;
    
try {
  const data = jwtDecode(token);
  console.log('Decoded JWT:', data);
  setUsername(data.username || 'Unknown User');
} catch (err) {
  console.error('Failed to decode JWT:', err);
}

    
  };

  getUsernameFromToken();
}, []);


  const getAllUsers = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      
      if (!token) return Alert.alert('Error', 'Token not found. Please login again.');

      const res = await axios.get('http://192.168.29.184:3000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
      setShowUsersModal(true);
    } catch (err) {
      console.error('Error fetching users:', err);
      Alert.alert('Error', 'Unable to fetch users.');
    }
  };

  const handleAddUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) return Alert.alert('Error', 'Token not found. Please login again.');

      await axios.post('http://192.168.29.184:3000/users', addUserForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'User added!');
      setAddUserForm({ username: '', password: '', role: 'viewer' });
      setShowAddUserModal(false);
    } catch (err) {
      console.error('Add user failed:', err);
      Alert.alert('Error', 'Could not add user.');
    }
  };

  const MenuItem = ({ icon, label, onPress, bgColor = '#ccc' }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem}>
    <View style={styles.iconLabel}>
      <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
        {icon}
      </View>
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Icons.CaretRightIcon size={20} color="#fff"/>
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.container}>
      <Typo size={24} fontWeight="700" color="white" style={{ textAlign: 'center', marginBottom: 20 }}>
        Profile
      </Typo>

      <View style={styles.profileCircle}>
        <Text style={styles.profileInitial}>A</Text>
      </View>

      <Text style={styles.name}>{username}</Text>

      <View style={styles.menu}>
        <MenuItem
          label="Add User"
          icon={<Icons.UserIcon size={20} color="white" weight="fill"/>}
          onPress={() => setShowAddUserModal(true)}
            bgColor="#5865f2"
        />
        <MenuItem
          label="Get All Users"
          icon={<Icons.UserPlusIcon size={20} color="white" weight="fill"/>}
          onPress={getAllUsers}
          bgColor="#43b581"
          
        />
        <MenuItem
          label="Privacy Policy"
          icon={<Icons.LockKeyIcon size={20} color="white" weight="fill"/>}
          onPress={() => Alert.alert('Privacy Policy', 'Coming soon')}
           bgColor="#999"
        />
        <MenuItem
          label="Logout"
          icon={<Icons.SignOutIcon size={20} color="white" weight="fill" />}
          onPress={handleLogout}
          bgColor="#f04747"
        />
      </View>

      {/* --- Add User Modal --- */}
      <Modal visible={showAddUserModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typo size={20} fontWeight="700" style={{ textAlign: 'center', marginBottom: 5 }} >Add User</Typo>

            <TextInput
              placeholder="Username"
              value={addUserForm.username}
              onChangeText={(text) => setAddUserForm({ ...addUserForm, username: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={addUserForm.password}
              onChangeText={(text) => setAddUserForm({ ...addUserForm, password: text })}
              style={styles.input}
              placeholderTextColor="#888"
            />
<View style={[styles.input, { height: 40, justifyContent: 'center' }]}>
  <Picker
    selectedValue={addUserForm.role}
    onValueChange={(itemValue) => setAddUserForm({ ...addUserForm, role: itemValue })}
    dropdownIconColor="white"
    style={{ color: 'white', fontSize: 14, height: 40 }}
    mode="dropdown"
  >
    <Picker.Item label="Select role" value="" color="#aaa" />
    <Picker.Item label="Admin" value="admin" />
    <Picker.Item label="Viewer" value="viewer" />
  </Picker>
</View>




            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity onPress={() => setShowAddUserModal(false)} style={styles.cancelBtn}>
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddUser} style={styles.saveBtn}>
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- All Users Modal --- */}
      <Modal visible={showUsersModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: colors.neutral800 }}>
          <Typo size={24} fontWeight="700" color="white" style={{ textAlign: 'center', marginBottom: 20 }}>
  Users
</Typo>

          <FlatList
            data={users}
            keyExtractor={(item) => item._id || item.username}
            renderItem={({ item }) => (
  <View style={styles.userCard}>
    <View style={[styles.iconCircle, { backgroundColor: item.role === 'admin' ? '#5865f2' : '#43b581' }]}>
      {item.role === 'admin' ? (
        <Icons.UserCirclePlusIcon size={25} color="white" weight="fill" />
      ) : (
        <Icons.UserCircleIcon size={25} color="white" weight="fill" />
      )}
    </View>
    <Text style={styles.usernameText}>{item.username}</Text>
    <Text style={[styles.roleText, { color: item.role === 'admin' ? '#f87171' : '#4ade80' }]}>
      {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
    </Text>
  </View>
)}

          />
          <TouchableOpacity onPress={() => setShowUsersModal(false)} style={styles.closeBtn}>
            <Text style={{ color: 'white' }}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    padding: 20,
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.darkblue,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
  },
  profileInitial: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  email: {
    color: '#bbb',
    textAlign: 'center',
    marginBottom: 20,
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#eee',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.neutral400,
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    color: 'white',
  },
  cancelBtn: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: '#444',
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  iconCircle: {
  width: 40,
  height: 40,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
},userCard: {
  backgroundColor: colors.neutral700,
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderRadius: 12,
  marginVertical: 6,
  gap: 12,
},
usernameText: {
  flex: 1,
  fontSize: 16,
  color: 'white',
  fontWeight: '500',
},
roleText: {
  fontSize: 14,
  fontWeight: '600',
},


});
