import {Platform, Text, TouchableOpacity, View} from 'react-native'
import React from 'react'
import {Actions} from 'react-native-router-flux'
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
    container: {
        height: (Platform.OS === 'ios') ? 64 : 54,
        flexDirection: 'row',
        flex: 0,
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: 'lightgrey',
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8'
    },
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
    title: {
        fontSize: '1.5rem',
        color: '#979797',
    },
    head: {
        width: '100%',
        height: 20,
        backgroundColor: 'white'
    }
});

export default class JobsNavBar extends React.Component {

    _renderLeft() {
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

    _renderMiddle() {
        return (
            <Text style={styles.title}>{this.props.title}</Text>
        )
    }

    render() {
        return (
            <View>
                <View style={styles.head}/>
                <View style={styles.container}>
                    {this._renderLeft()}
                    {this._renderMiddle()}
                </View>
            </View>
        )
    }
}
