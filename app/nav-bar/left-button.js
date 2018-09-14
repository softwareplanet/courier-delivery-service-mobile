import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {TouchableOpacity, View} from "react-native";

const styles = EStyleSheet.create({
    navline: {
        height: '13%',
        backgroundColor: '#979797',
        width: '100%'
    },
    navbarOpener: {
        height: '1.3rem',
        width: '1.8rem',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: '1rem',
    },
});

export default class LeftButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={Actions.pop}
                style={styles.navbarOpener}>
                <View style={styles.navline}/>
                <View style={styles.navline}/>
                <View style={styles.navline}/>
            </TouchableOpacity>
        )
    }
}
