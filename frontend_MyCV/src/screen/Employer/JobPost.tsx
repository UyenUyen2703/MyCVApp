import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenName } from '../../constants/ScreenName';
import RootStackParamList from '../../navigator/RootStackParamList';
import { BASE_URL } from '../../utils/url';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Khai báo kiểu cho props 'navigation'
type Props = NativeStackScreenProps<RootStackParamList, 'JobPost'>;

const JobPost = ({ navigation }: Props) => {
    const route = useRoute();
    const [show, setShow] = useState<boolean>(false);
    const [showDataJob, setShowDataJob] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [locationCity, setlocationCity] = useState<string>('');
    const [salary, setSalary] = useState<string>('');
    const [jobType, setJobType] = useState('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [user, setUser] = useState<any>(null);
    const [companyName, setCompanyName] = useState<string>('');
    const [requirement, setRequirement] = useState<string>('');
    const [benefits, setBenefits] = useState<string>('');
    const [experience, setExperience] = useState<string>('');
    const [education, setEducation] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [gender, setGender] = useState<string>('');
    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUserInfo = JSON.parse(userInfo);
                setUser(parsedUserInfo);
                const company = await axios.get(`${BASE_URL}/employers/${parsedUserInfo.data.user.id}`);
                setCompanyName(company.data.companyName);
            }
        };
        getInfo();
    }, []);
    const onChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || deadline;
        setShow(Platform.OS === 'ios');
        setDeadline(currentDate);
    };
    const BackHandler = () => {
        navigation.goBack();
    }
    const handlePickerFocus = () => {
        setShowDataJob(true);
        Keyboard.dismiss();
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };



    const handleSubmit = async () => {
        if (title && companyName && locationCity && requirement && benefits && salary && deadline && experience && education && quantity && gender && jobType && jobDescription.length > 30) {
            try {
                const JobsData = {
                    userId: user.data.user.id,
                    title,
                    companyName,
                    location: locationCity,
                    salary,
                    requirement,
                    benefits,
                    additionalInfo: {
                        deadline: deadline ? deadline.toISOString() : new Date().toISOString(),
                        experience: '1 năm',
                        education: 'Đại học',
                        quantity: 1,
                        gender: 'Nam',
                    },
                    jobType,
                    jobDescription,
                    status: 'Mở',
                };
                console.log('Submitting employer data:', JobsData);
                const response = await axios.post(`${BASE_URL}/jobs`, JobsData);
                Alert.alert('Thành công', 'Bạn đã đăng ký thành công');
                navigation.navigate('HomeEmployer', { userId: user.data.user.id });
            } catch (error) {
                console.error('Error creating employer:', error);
                Alert.alert('Lỗi', 'Đã có lỗi xảy ra');
            }
        } else if (jobDescription.length < 30) {
            Alert.alert('Lỗi', 'Mô tả công việc phải có ít nhất 30 ký tự');
        }
        else {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.content}>
                        <Icon name="arrow-back-outline" onPress={BackHandler} size={28} color="#011F82" />
                        <Text style={styles.title} onPress={BackHandler}>Tạo bài đăng tuyển dụng</Text>
                    </View>
                    <Image style={styles.imgPost}
                        source={require('../../../assets/images/jobpostImg.jpg')} />
                </View>
                <ScrollView>

                    <View style={styles.inputinfor}>
                        {/* Job Title*/}
                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'user'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Chức vụ</Text>
                        </View>
                        <TextInput
                            style={styles.textinput}
                            placeholder='Chức vụ'
                            onChangeText={setTitle}
                        />
                        {/* Company Name*/}
                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'building'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Tên công ty</Text>
                        </View>
                        <Text style={styles.textinput}>{companyName}</Text>
                        {/* Job Type*/}
                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'business-time'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Loại việc làm</Text>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={jobType}
                                onValueChange={(itemValue: string, itemIndex: number) => setJobType(itemValue)}
                                onFocus={handlePickerFocus}
                                style={styles.textinput}
                                itemStyle={styles.pickerItem}
                                mode='dialog'>
                                <Picker.Item label="Chọn một loại việc làm" value="choose" />
                                <Picker.Item label="Bán thời gian" value="Part-Time" />
                                <Picker.Item label="Toàn thời gian" value="Full-Time" />
                                <Picker.Item label="Cố Định" value="Permanent" />
                                <Picker.Item label="Thời vụ" value="Seasonal" />
                                <Picker.Item label="Thực tập" value="Internship" />
                            </Picker>
                        </View>

                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'dollar-sign'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Mức lương</Text>
                        </View>

                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={salary}
                                onValueChange={(itemValue: string, itemIndex: number) => setSalary(itemValue)}
                                onFocus={handlePickerFocus}
                                style={styles.textinput}
                                itemStyle={styles.pickerItem}
                                mode='dialog'>
                                <Picker.Item label="Chọn một mức lương" value="choose" />
                                <Picker.Item label="$1000 - $1500" value="$1000 - $1500" />
                                <Picker.Item label="$1500 - $2000" value="$1500 - $2000" />
                                <Picker.Item label="$2500 - $3000" value="$2500 - $3000" />
                                <Picker.Item label="$3500 - $4000" value="$3500 - $4000" />
                                <Picker.Item label="Bàn bạc sau" value="Bàn bạc sau" />
                            </Picker>
                        </View>
                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'map-marker-alt'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Địa chỉ</Text>
                        </View>
                        <TextInput
                            style={styles.textinput}
                            placeholder='Vị trí làm việc'
                            onChangeText={setlocationCity}
                        />

                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'calendar-alt'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Ngày hết hạn</Text>
                        </View>
                        <Text onPress={showDatePicker} style={styles.textinput}>
                            {deadline ? formatDate(deadline) : "dd/mm/yyyy"}
                        </Text>
                        {show && (
                            <DateTimePicker
                                value={deadline || new Date()}
                                mode="date"
                                display="calendar"
                                onChange={onChange}
                            />
                        )}

                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'clipboard'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Mô tả công việc</Text>
                        </View>
                        <TextInput
                            style={styles.textinput}
                            placeholder='Mô tả công việc'
                            multiline={true}
                            textAlignVertical='top'
                            onChangeText={setJobDescription}
                        />

                        <View style={styles.inputRow}>
                            <MaterialIcons name="checklist" size={25} color="#011F82" />
                            <Text style={styles.label}>Yêu cầu công việc</Text>
                        </View>
                        <TextInput
                            style={styles.textinput}
                            placeholder='Yêu cầu công việc'
                            multiline={true}
                            textAlignVertical='top'
                            onChangeText={setRequirement}
                        />

                        <View style={styles.inputRow}>
                            <FontAwesome5 name="hands-helping" size={25} color="#011F82" />
                            <Text style={styles.label}>Quyền lợi</Text>
                        </View>

                        <TextInput
                            style={styles.textinput}
                            placeholder='Quyền lợi'
                            multiline={true}
                            textAlignVertical='top'
                            onChangeText={setBenefits}
                        />

                        <View style={styles.inputRow}>
                            <FontAwesome5 name={'user-graduate'} size={25} color={'#011F82'} />
                            <Text style={styles.label}>Kinh nghiệm</Text>
                        </View>

                        <TextInput
                            style={styles.textinput}
                            placeholder='Kinh nghiệm'
                            onChangeText={setExperience}
                        />

                        <View style={styles.inputRow}>
                            <MaterialIcons name="school" size={25} color="#011F82" />
                            <Text style={styles.label}>Trình độ</Text>
                        </View>


                        <TextInput
                            style={styles.textinput}
                            placeholder='Trình độ'
                            onChangeText={setEducation}
                        />

                        <View style={styles.inputRow}>
                            <MaterialIcons name="groups" size={25} color="#011F82" />
                            <Text style={styles.label}>Số lượng cần tuyển</Text>
                        </View>

                        <TextInput
                            style={styles.textinput}
                            placeholder='Số lượng nhân viên'
                            onChangeText={(text) => setQuantity(parseInt(text))}
                        />

                        <View style={styles.inputRow}>
                            <FontAwesome5 name="venus-mars" size={25} color="#011F82" />
                            <Text style={styles.label}>Giới tính</Text>
                        </View>

                        <TextInput
                            style={styles.textinput}
                            placeholder='Giới tính'
                            onChangeText={setGender}
                        />
                    </View>

                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.submitButton}>Đăng bài</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </GestureHandlerRootView >

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFC',
    },
    header: {
        position: 'relative',
        marginBottom: 10,
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        paddingLeft: 10,
        alignItems: 'center',
        zIndex: 1000, // Cho phần header hiển thị trên cùng
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        flexDirection: 'row',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#011F82',
        marginLeft: 10,
    },
    imgPost: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        marginTop: 60,
        borderRadius: 10,
    },
    inputinfor: {
        marginBottom: 20,
        padding: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#011F82',
    },
    textinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 5,
        color: '#000',

    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    pickerItem: {
        fontSize: 16,
    },
    submitButton: {
        width: '60%',
        backgroundColor: '#011F82',
        color: '#fff',
        textAlign: 'center',
        padding: 15,
        borderRadius: 5,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 5,
    },

});

export default JobPost;
