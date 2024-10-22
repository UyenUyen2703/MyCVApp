import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, TextInput, Title } from 'react-native-paper';

const CreateEmployer = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [numberOfEmployees, setNumberOfEmployees] = useState('');
  const [fullName, setFullName] = useState('');
  const [howDidYouHear, setHowDidYouHear] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [describe, setDescribe] = useState('');

  const handleSubmit = async () => {
    if (selectedCompany && companyName && numberOfEmployees && fullName && howDidYouHear && phoneNumber && describe) {
      try {
        const employerData = {
          selectedCompany,
          companyName,
          numberOfEmployees,
          fullName,
          howDidYouHear,
          phoneNumber,
          describe,
        };
        console.log('Submitting employer data:', employerData);
<<<<<<< HEAD
        const response = await axios.post('http://10.102.74.123:3000/employers', employerData);
        console.log('Employer created:', response.data);
=======
        const response = await axios.post('http://10.102.74.189:3000/employers', employerData);
>>>>>>> 6b7074647704898e8336b268b9b527a2c6dbd0ae
        Alert.alert('Thành công', 'Bạn đã đăng ký thành công');
      } catch (error) {
        console.error('Error creating employer:', error);
        Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
      }
    } else {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Title style={styles.title}>Tạo đơn tuyển dụng</Title>
        <Image style={styles.imgBg}
          source={require('../../../assets/images/bgImg.png')}
        />
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.subtitle}>Ngành của công ty</Title>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCompany}
                onValueChange={(itemValue: string, itemIndex: number) => setSelectedCompany(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Chọn một tùy chọn" value="choose" />
                <Picker.Item label="Bán lẻ và buôn bán" value="sales" />
                <Picker.Item label="Bảo hiểm" value="insurance" />
                <Picker.Item label="Công nghệ" value="technology" />
                <Picker.Item label="Dịch vụ" value="service" />
                <Picker.Item label="Giáo dục" value="education" />
                <Picker.Item label="IT" value="IT" />
                <Picker.Item label="Y tế" value="healthcare" />
                <Picker.Item label="Xây dựng" value="construction" />
                <Picker.Item label="Bất động sản" value="realEstate" />
              </Picker>
            </View>
            <Title style={styles.subtitle}>Tên của công ty</Title>
            <TextInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#6200ee', outline: '#E4E0E1' } }}
            />
            <Title style={styles.subtitle}>Số lượng nhân viên</Title>

            <TextInput
              label="Nhập số lượng nhân viên"
              value={numberOfEmployees}
              onChangeText={setNumberOfEmployees}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#6200ee', outline: '#E4E0E1' } }}
            />
            <Title style={styles.subtitle}>Họ và tên của bạn</Title>

            <TextInput
              label="Hãy nhập họ và tên của bạn"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#6200ee', outline: '#E4E0E1' } }}
            />
            <Title style={styles.subtitle}>Bạn biết đến tôi từ đâu</Title>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={howDidYouHear}
                onValueChange={(itemValue: string, itemIndex: number) => setHowDidYouHear(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Chọn một tùy chọn" value="choose" />
                <Picker.Item label="Facebook" value="facebook" />
                <Picker.Item label="Google" value="google" />
                <Picker.Item label="LinkedIn" value="linkedIn" />
                <Picker.Item label="Twitter" value="twitter" />
                <Picker.Item label="Từ bạn bè" value="friends" />
                <Picker.Item label="Từ gia đình" value="family" />
                <Picker.Item label="Từ đối tác" value="partner" />
                <Picker.Item label="Từ khách hàng" value="customer" />
                <Picker.Item label="Từ nhân viên" value="employee" />
                <Picker.Item label="Từ nhà cung cấp" value="supplier" />
                <Picker.Item label="Từ người khác" value="other" />
              </Picker>
            </View>

            <Title style={styles.subtitle}>Thêm số điện thoại của bạn</Title>
            <TextInput
              label="Nhập số điện thoại của bạn"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="decimal-pad"
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: '#6200ee', outline: '#E4E0E1' } }}
            />
            <Title style={styles.subtitle}>Mô tả công ty</Title>
            <Title style={styles.describe}>Giới thiệu công ty của bạn
              với mọi người trong vài dòng ngắn gọn.</Title>

            <TextInput
              placeholder="Giới thiệu công ty của bạn bằng cách nói về hoạt động kinh doanh, vị trí thị trường của bạn, văn hóa công ty của bạn, v.v."
              value={describe}
              onChangeText={setDescribe}
              multiline={true}
              numberOfLines={4}
              style={styles.input}
              theme={{ colors: { primary: '#6200ee', outline: '#E4E0E1' } }}
            />

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>Submit</Button>
          </Card.Content>
        </Card>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imgBg: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
  },
  title: {
    marginBottom: 10,
    lineHeight: 50,
    marginTop: 10,
    fontSize: 40,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'left',
  },
  describe: {
    fontSize: 14,

  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E4E0E1',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },

});

export default CreateEmployer;