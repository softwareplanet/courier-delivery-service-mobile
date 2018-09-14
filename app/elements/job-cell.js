import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';


const styles = EStyleSheet.create({
    listItem: {
        flex: 0,
        width: '100%',
        height: '4.5rem',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        padding: '0.5rem',
        paddingHorizontal: '1.5rem',
    },
    textArea: {
        fontSize: '1.2rem',
        color: '#9b9b9b',
        fontWeight: 'bold'
    },
    address: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    badge: {
        width: '0.8rem',
        height: '0.8rem',
        backgroundColor: '#d8d8d8',
        marginRight: '0.5rem',
    },
    locationText: {
        fontSize: '0.9rem',
        color: '#a5a5a5'
    }
});

export default class JobCell extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const job = this.props.job;
        return (
            <TouchableOpacity
                style={styles.listItem}
                onPress={() => this.props.showDetails(job)}>
                <View>
                    <Text style={styles.textArea}>{job.id} {job.title}</Text>
                    <View style={styles.address}>
                        <View style={styles.badge}/>
                        <Text style={styles.locationText}>{job.location}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
