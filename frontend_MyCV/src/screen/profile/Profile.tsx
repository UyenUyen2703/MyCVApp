import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import { appColors } from '../../constants/appColors';
import ScreenName from '../../constants/ScreenName';
import { RootStackParamList } from '../../navigator/RootStackParamList';
import { signOut } from '../../utils/auth';
import { BASE_URL } from '../../utils/url';

type Props = NativeStackScreenProps<RootStackParamList, ScreenName>;
const { width, height } = Dimensions.get('window');

interface CV {
    _id: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    address: {
        country: string;
        city: string;
        address: string;
        zipCode: string;
    };
    education: {
        educationLevel: string;
        fieldOfStudy: string;
        schoolName: string;
        educationCountry: string;
        educationCity: string;
        educationStartDate: string;
        educationEndDate: string;
    };
    experience: {
        companyName: string;
        jobTitle: string;
        workCountry: string;
        workCity: string;
        workStartDate: string;
        workEndDate: string;
    };
    skills: string;
    certifications: string;
    birthDate: string;
    summary: string;
    jobPreferences: {
        desiredJobTitle: string;
        jobType: string;
        minimumSalary: string;
    };
}

const Profile = ({ navigation, route }: Props) => {
    const { userEmail, userId, jobId, jobName } = route.params as { userEmail: string, userId: string, jobId: string, jobName: string };
    const [menuVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [cvs, setCvs] = useState<CV[]>([]);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    useEffect(() => {
        const getInfo = async () => {
            const userInfo = await AsyncStorage.getItem('userInfo');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
            }
        };

        const getCV = async () => {
            const cvInfo = await AsyncStorage.getItem('cvInfo');
            if (cvInfo) {
                setCvs(JSON.parse(cvInfo));
                console.log("cvInfo:", cvInfo);

            }
        }
        getInfo();
        getCV();
    }, []);

    useEffect(() => {
        const fetchCVs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/cv_form/user/${userId}`).then(
                    (response) => {
                        setCvs(response.data);
                    }
                );
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu CVs:', error);
            }
        };

        fetchCVs();
    }, [userId]);

    useEffect(() => {
        console.log("cvs----", cvs);
    }, [cvs]);

    const confirmApplyNow = async (cvId: string) => {
        try {
            const response = await axios.get(`${BASE_URL}/cv_form/${cvId}`);
            const cv = response.data;

            if (cv) {
                const CVfullNameUser = cv.fullName;
                const CVEmailUser = cv.email;
                const status = 'applied';

                // Kiểm tra nếu ứng tuyển đã tồn tại
                const existingApplicationResponse = await axios.get(
                    `${BASE_URL}/applications?cvId=${cvId}&jobId=${jobId}&userId=${userId}`
                );

                if (
                    existingApplicationResponse.data.some(
                        (application: any) =>
                            application.cvId === cvId &&
                            application.jobId === jobId &&
                            application.userId === userId
                    )
                ) {
                    Alert.alert('Thông báo', 'Bạn đã ứng tuyển vào công việc này rồi!');
                } else {
                    // Tạo mới ứng tuyển
                    await axios.post(`${BASE_URL}/applications`, {
                        cvId,
                        jobId,
                        jobName, // Lấy jobName từ route.params
                        CVfullNameUser,
                        CVEmailUser,
                        status,
                        userId,
                    });
                    Alert.alert('Thành công', 'Bạn đã ứng tuyển thành công!');
                    navigation.navigate('JobDetail', { jobId, jobName, userId, userEmail });
                }
            } else {
                Alert.alert('Lỗi', 'Không tìm thấy CV để ứng tuyển.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi ứng tuyển. Vui lòng thử lại.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={32} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>HỒ SƠ XIN VIỆC CỦA BẠN</Text>
                <TouchableOpacity onPress={toggleMenu}>
                    <Icon name="cog" type="font-awesome" size={30} color="#A6AEBF" />
                </TouchableOpacity>
            </View>
            <Modal
                transparent={false}
                visible={menuVisible}
                animationType='slide'
                onRequestClose={toggleMenu}
            >
                <View style={styles.fullMenu}>
                    <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
                        <Icon name="close" size={30} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.menuContent}>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuItemText}>Cài đặt</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => signOut(dispatch)}>
                            <Text style={styles.menuItemText}>Đăng xuất</Text>
                            <Text style={{ fontSize: 16, fontWeight: '300', paddingHorizontal: 20, marginTop: 3 }}>{userEmail}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.content}>
                <FlatList
                    data={cvs.filter((cv) => cv.userId === userId)}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.cvItem}
                            onPress={() => confirmApplyNow(item._id)} // Truyền cvId
                        >
                            <Text style={styles.cvTitle}>Họ tên: {item.fullName}</Text>
                            <Text>Email: {item.email}</Text>
                            <Text>SĐT: {item.phone}</Text>
                            <Text>Địa chỉ: {item.address.city}, {item.address.country}</Text>
                            <Text>Kỹ năng: {item.skills}</Text>
                            <Text>Loại công việc mong muốn: {item.jobPreferences.jobType}</Text>
                        </TouchableOpacity>
                    )}
                />


                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CVCreate')}>
                    <Text style={styles.buttonText}>Tạo hồ sơ</Text>
                </TouchableOpacity>
            </View>

            <Navbar navigation={navigation} route={route} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#011F82',
    },
    backButton: {
        marginRight: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007AFF',
        width: width * 0.9,
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    agreementText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    cvItem: {
        width: width * 0.9,
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginVertical: 10,
    },
    cvTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    copyright: {
        fontSize: 12,
        color: '#666',
    },
    footerLink: {
        fontSize: 12,
        color: '#007AFF',
    },
    fullMenu: {
        flex: 1,
        backgroundColor: '#fff',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 16,
    },
    menuContent: {
        flex: 1,
        alignItems: 'center',
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: appColors.gray3,
        width: '100%',
    },
    menuItemText: {
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default Profile;
