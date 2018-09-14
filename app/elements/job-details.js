import React from 'react';
import {AsyncStorage, Button, FlatList, ScrollView, Text, View} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {locals} from '../../env.dev';
import * as Geolocation from "../geolocation/geolocationService";
import {store} from '../redux/storeOffline';
const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
        padding: '1rem'
    },
    colContainer: {
        margin: 10,
        width: '100%'
    },
    colName: {
        fontSize: '0.8rem',
        color: '#979797'
    },
    colText: {
        fontSize: '1rem',
        color: 'black',
        fontWeight: 'bold'
    },
    statusBtn: {
        paddingBottom: 10
    }
});

export default class JobDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            job: this.props.job,
            token: null
        }
    }

    async changeStatus(status) {
        store.dispatch(this.sendNewStatus({id: status.id}));
        let {job} = this.state;
        job.status = status;
        this.props.updateJob(job);
        Geolocation.sendCurrentLocation(job.id, job.status.id);
        this.setState({job});
        /*fetch(locals.apiHost + `jobs/${this.state.job.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({id: status.id}),
            headers: new Headers({
                'Authorization': 'Bearer '+  await AsyncStorage.getItem('token'),
                'Content-Type': 'application/json'
            })
        }).then(res => res.json())
            .then(job => {
                this.props.updateJob(job);
                Geolocation.sendCurrentLocation(job.id, job.status.id);
                this.setState({job})
            }).catch(error => console.log(error));*/
    }

    sendNewStatus = body => ({
        type: 'SEND_NEW_STATUS',
        payload: {body},
        meta: {
            offline: {
                effect: {
                    url: locals.apiHost + `jobs/${this.state.job.id}/status`,
                    headers: {'Authorization': 'Bearer ' + this.state.token},
                    method: 'PATCH',
                    body: JSON.stringify(body)
                },
            }
        }
    });

    async componentDidMount() {
        if(!this.state.token) this.setState({token: await AsyncStorage.getItem('token')});
        /*fetch(locals.apiHost + `jobs/${this.state.job.id}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token')
            })
        })
            .then(res => res.json())
            .then(job => {
                //this.setState({job});
            })*/
    }

    render() {
        const job = this.state.job;
        const transitions = this.props.transitions.filter(item => item.statusFrom.id === job.status.id);
        return (
            <ScrollView style={styles.container}>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>ID</Text>
                    <Text style={styles.colText}>{job.id}</Text>
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>TITLE</Text>
                    <Text style={styles.colText}>{job.title}</Text>
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>DESCRIPTION</Text>
                    <Text style={styles.colText}>{job.description}</Text>
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>LOCATION</Text>
                    <Text style={styles.colText}>{job.location}</Text>
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>CUSTOMER</Text>
                    <Text style={styles.colText}>{job.customerName}</Text>
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>PHONE</Text>
                    <FlatList
                        data={job.phones}
                        renderItem={({item}) => <Text style={styles.colText}>{item.number}</Text>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View style={styles.colContainer}>
                    <Text style={styles.colName}>CURRENT STATUS</Text>
                    <Text style={styles.colText}>{job.status.title}</Text>
                </View>

                <FlatList
                    data={transitions}
                    renderItem={({item}) => <View style={styles.statusBtn}>
                        <Button  onPress={() => this.changeStatus(item.statusTo)}
                                title={item.action}/>
                    </View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </ScrollView>
        );
    }
}
