import React from 'react';
import {Platform, StatusBar, AsyncStorage, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {
    Actions,
    Router,
    Scene
} from 'react-native-router-flux';

import AppContainer from './app/AppContainer';
import JobDetails from './app/elements/job-details';
import LeftButton from './app/nav-bar/left-button';

import EStyleSheet from 'react-native-extended-stylesheet';
import Stack from "react-native-router-flux/src/Stack";
import Login from "./app/login/login";

EStyleSheet.build();
const styles = EStyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? 44 : 64,
        paddingTop: (Platform.OS === 'ios') ? 0 : 15,
    },
    title: {
        fontSize: '1.5rem',
        color: '#979797',
    }
});

StatusBar.setBarStyle('dark-content', true);

const scenes = Actions.create(
    <Stack key="root"
           renderLeftButton={()=><LeftButton/>}
           titleStyle={styles.title}
           activeBackgroundColor={'white'}
           navigationBarStyle={styles.container}
           renderRightButton={()=><TouchableOpacity onPress={logout}><SvgUri
               style={{marginRight: 10}}
               width="28"
               height="28"
               source={require('./assets/sign-out-option.svg')}
           /></TouchableOpacity>}>
        <Scene key="login"
               title="CDS"
               style={{backgroundColor: '#ffffff'}}
               hideNavBar={true}
               component={Login}/>
        <Scene key="jobs"
               title="Jobs"
               component={AppContainer}
        />
        <Scene key="jobDetails"
               title="Details"
               back={true}
               component={JobDetails}
               backButtonTintColor={'#979797'}/>
    </Stack>
);

function logout() {
    AsyncStorage.removeItem('token');
    Actions.reset('login');
}

export default class Periods extends React.Component {
    render() {
        return (<Router scenes={scenes}/>);
    }
}


