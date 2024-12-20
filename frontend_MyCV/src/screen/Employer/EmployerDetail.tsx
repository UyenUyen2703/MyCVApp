import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavbarEmployer from '../../components/NavbarEmployer';
import ScreenName from '../../constants/ScreenName';
import { RootStackParamList } from '../../navigator/RootStackParamList';
import { BASE_URL } from '../../utils/url';

type Props = NativeStackScreenProps<RootStackParamList, ScreenName>;

interface Job {
  deadline: string;
  _id: string;
  title: string;
  companyName: string;
  location: string;
  salary: string;
  jobType: string;
  jobDescription: string;
  requirement: string;
  benefits: string;
  additionalInfo: {
    deadline: string;
    experience: string;
    education: string;
    quantity: number;
    gender: string;
  };
  status: "Chọn trạng thái" | "Mở" | "Tạm dừng" | "Đã đóng"; // Add status field here
}

const EmployerDetail= ({ navigation,route }: Props) => {
  const [applicants, setApplicants] = useState([]); // State to store applicants
  const { jobId } = route.params as { jobId: string };

  const [jobDetails, setJobDetails] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }
    fetchJobDetail();
  }, [jobId]); // Empty dependency array to run effect only once

  const [jobStatus, setJobStatus] = useState<string>(jobDetails?.status || '');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setJobStatus(newStatus); // Cập nhật trạng thái trong giao diện

    try {
      setLoading(true);
      // Gửi yêu cầu cập nhật trạng thái lên server
      const response = await axios.put(`${BASE_URL}/jobs/${jobDetails?._id}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        Alert.alert("Thành công", "Trạng thái công việc đã được cập nhật.");
      } else {
        Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      Alert.alert("Lỗi", "Không thể kết nối với server.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back-outline" size={28} color="#011F82" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{jobDetails?.title}</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>

        {/* Company and Location */}
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{jobDetails?.companyName}</Text>
          <Text style={styles.location}>{jobDetails?.location}</Text>
        </View>
        {/* Job Status */}
        <View style={styles.statusContainer}>
          <Icon name="information-circle-outline" size={20} color="#011F82" />
          <Text style={styles.statusLabel}>Trạng thái:</Text>
          <Picker
            selectedValue={jobStatus}
            style={styles.statusPicker}
            mode="dropdown"
            onValueChange={(itemValue) => handleStatusChange(itemValue)}
            dropdownIconColor="#1976D2"
          >
            <Picker.Item label="Mở" value="Mở" style={{ color: '#011F82' }} />
            <Picker.Item label="Tạm dừng" value="Tạm dừng" style={{ color: '#011F82' }} />
            <Picker.Item label="Đã đóng" value="Đã đóng" style={{ color: '#011F82' }} />
          </Picker>
        </View>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết công việc</Text>
          <View style={styles.detailRow}>
            <Icon name="pricetag-outline" size={20} color="#10B981" />
            <Text style={styles.detailText}>{jobDetails?.salary}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="briefcase-outline" size={20} color="#011F82" />
            <Text style={styles.detailText}>{jobDetails?.jobType}</Text>
          </View>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <View style={styles.inputRow}>
            <FontAwesome5 name={'clipboard'} size={25} color={'#011F82'} />
            <Text style={styles.label}>Mô tả công việc</Text>
          </View>
          <Text style={styles.description}>{jobDetails?.jobDescription}</Text>
        </View>

        {/* Requirements */}
        {jobDetails?.requirement && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yêu cầu công việc</Text>
            <Text style={styles.description}>{jobDetails?.requirement}</Text>
          </View>
        )}

        {/* Benefits */}
        {jobDetails?.benefits && (
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <FontAwesome5 name="hands-helping" size={25} color="#011F82" />
              <Text style={styles.label}>Quyền lợi được hưởng</Text>
            </View>
            <Text style={styles.description}>{jobDetails.benefits}</Text>
          </View>
        )}

        {/* Additional Information */}
        {jobDetails?.additionalInfo && (
          <View style={styles.section}>
            <View style={styles.inputRow}>
              <MaterialIcons name="description" size={25} color="#011F82" />
              <Text style={styles.label}>Thông tin bổ sung</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="calendar-outline" size={20} color="#011F82" />
              <Text style={styles.detailText}>Hạn nộp: {formatDate(jobDetails.additionalInfo.deadline)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="briefcase-outline" size={20} color="#011F82" />
              <Text style={styles.detailText}>Kinh nghiệm: {jobDetails.additionalInfo.experience}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="school-outline" size={20} color="#011F82" />
              <Text style={styles.detailText}>Trình độ học vấn: {jobDetails.additionalInfo.education}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="people-outline" size={20} color="#011F82" />
              <Text style={styles.detailText}>Số lượng cần tuyển: {jobDetails.additionalInfo.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="male-female-outline" size={20} color="#011F82" />
              <Text style={styles.detailText}>Giới tính: {jobDetails.additionalInfo.gender}</Text>
            </View>
          </View>
        )}

        {/* Apply Button */}
        <View style={styles.btn}>
          <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate('JobPost' as never)}>
            <Text style={styles.applyButtonText}>Tạo đơn tuyển dụng mới</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewcv} onPress={() => navigation.navigate('ApplyManager', { jobId: jobDetails?._id || '' })}>
            <Text style={styles.applyButtonText}>Xem thông tin ứng viên</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NavbarEmployer navigation={navigation} route={route} />
    </View>

  );
};

export default EmployerDetail;
const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginLeft: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#011F82',
    marginLeft: 30,
  },
  companyInfo: {
    marginBottom: 16,
  },
  companyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#011F82',
    marginBottom: 4,
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
  location: {
    fontSize: 20,
    color: '#6D92D0',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 18,
    marginLeft: 8,
    color: '#011F82',
  },
  statusPicker: {
    // flex: 1,
    width: 140, // Đặt chiều rộng cố định cho Picker
    marginLeft: 8,
    paddingHorizontal: 0, // Giảm padding ngang
    color: '#011F82',
  },
  statusText: {
    fontSize: 18,
    marginLeft: 8,
  },
  statusOpen: {
    color: 'green',
    fontWeight: 'bold',
  },
  statusPaused: {
    color: 'orange',
    fontWeight: 'bold',
  },
  statusClosed: {
    color: 'red',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#011F82',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#011F82',
  },
  description: {
    fontSize: 18,
    color: '#4B5563',
    lineHeight: 22,
  },
  applyButton: {
    width: '48%',
    backgroundColor: '#011F82',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewcv: {
    width: '48%',
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});
