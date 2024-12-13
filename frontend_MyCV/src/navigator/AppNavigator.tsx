import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import 'react-native-get-random-values';
import ScreenName from '../constants/ScreenName';
import ApplyManager from '../screen/Employer/ApplyManager';
import CreateEmployer from '../screen/Employer/CreateEmployer';
import CVDetail from '../screen/Employer/CvDetail';
import EmployerDetail from '../screen/Employer/EmployerDetail';
import HomeEmployer from '../screen/Employer/HomeEmployer';
import InforManager from '../screen/Employer/InforManager';
import JobPost from '../screen/Employer/JobPost';
import SendSMS from '../screen/Employer/SendSMS';
import Home from '../screen/home/Home';
import Login from '../screen/login/Login';
import Profile from '../screen/profile/Profile';
import SearchSceen from '../screen/home/SearchScreen';
import CVCreate from '../screen/User/CVCreate';
import CVManagerment from '../screen/User/CVManagerment';
import FavoriteJob from '../screen/User/FavoriteJob';
import JobDetail from '../screen/User/JobDetail';
import JobList from '../screen/User/JobList';
import ManageCVsApplied from '../screen/User/ManageCVsApplied';
import MessageScreen from '../screen/User/Message';
import SearchScreen from '../screen/home/SearchScreen';
import EditCV from '../screen/User/EditCV';
import { RootStackParamList } from './RootStackParamList';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name={ScreenName.CreateEmployer} component={CreateEmployer} />
            <Stack.Screen name={ScreenName.InforManager} component={InforManager} />
            <Stack.Screen name={ScreenName.EmployerDetail} component={EmployerDetail} />
            <Stack.Screen name={ScreenName.JobPost} component={JobPost} />
            <Stack.Screen name={ScreenName.SendSMS} component={SendSMS} />

            <Stack.Screen name={ScreenName.HomeEmployer} component={HomeEmployer} />
            <Stack.Screen name={ScreenName.ApplyManager} component={ApplyManager} />
            <Stack.Screen name={ScreenName.Home} component={Home} />
            <Stack.Screen name={ScreenName.SearchScreen} component={SearchScreen} />
            <Stack.Screen name={ScreenName.JobList} component={JobList} />
            <Stack.Screen name={ScreenName.JobDetail} component={JobDetail} />
            <Stack.Screen name={ScreenName.Profile} component={Profile} />
            <Stack.Screen name={ScreenName.CVCreate} component={CVCreate} />
            <Stack.Screen name={ScreenName.MessageScreen} component={MessageScreen} />
            <Stack.Screen name={ScreenName.CVManagerment} component={CVManagerment} />
            <Stack.Screen name={ScreenName.ManageCVsApplied} component={ManageCVsApplied} />
            <Stack.Screen name={ScreenName.Login} component={Login} />

            <Stack.Screen name={ScreenName.CVDetail} component={CVDetail} />
            <Stack.Screen name={ScreenName.EditCV} component={EditCV} />
            <Stack.Screen name={ScreenName.SearchScreen} component={SearchScreen} />
        </Stack.Navigator>
    );
};

export default App;