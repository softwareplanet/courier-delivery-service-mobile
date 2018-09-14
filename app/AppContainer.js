import React from 'react';
import {FlatList, AsyncStorage, View, Text, TextInput, RefreshControl} from 'react-native';
import * as Geolocation from "./geolocation/geolocationService";
import EStyleSheet from 'react-native-extended-stylesheet';
import {locals} from '../env.dev';
import JobCell from './elements/job-cell';
import {Actions} from "react-native-router-flux";

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },
    list: {
        width: '100%',
    },
    navbar: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: 'lightgrey',
        width: '100%',
        height: '3.2rem',
        alignItems: 'center'
    },
    searchInput: {
        backgroundColor: '#d8d8d8',
        height: '2.8rem',
        borderBottomWidth: 0,
        paddingLeft: '1rem'
    },

});

export default class AppContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobs: [],
            text: '',
            transitions: [],
            jobsToView: [],
            refreshing: false,
        };
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.getJobs();
    }

    componentDidMount() {
        if (!Geolocation.isWatching()) {
            Geolocation.startMonitoringLocationAsync();
        }
        this.getFromStorage();
        this.getJobs();
        this.getTransitions();
    }

    async getFromStorage() {
        const jobs = await AsyncStorage.getItem('jobs');
        const transitions = await AsyncStorage.getItem('transitions');
        this.setState({jobs: JSON.parse(jobs), jobsToView: JSON.parse(jobs)});
        this.setState({transitions: JSON.parse(transitions)});
    }

    async getTransitions() {
        fetch(locals.apiHost + 'statuses/transitions', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token').then(token => token)
            })
        })
            .then(res => res.json())
            .then(transitions => {
                AsyncStorage.setItem('transitions', JSON.stringify(transitions));
                this.setState({transitions: transitions});
            })
    }

    async getJobs() {
        return fetch(locals.apiHost + 'jobs/assignee', {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + await AsyncStorage.getItem('token').then(token => token)
            })
        })
            .then(res => res.json())
            .then(jobs => {
                AsyncStorage.setItem('jobs', JSON.stringify(jobs));
                this.setState({jobs: jobs, jobsToView: jobs});
                this.setState({refreshing: false});
            });
    }

    showDetails(job) {
        const {transitions} = this.state;
        Actions.push('jobDetails', {job: job, transitions: transitions, updateJob: this.updateJob.bind(this)});
    }

    updateJob(job) {
        let {jobs} = this.state;
        const index = jobs.findIndex(item => item.id === job.id);
        jobs[index] = job;
        AsyncStorage.setItem('jobs', JSON.stringify(jobs));
        this.setState({jobs});
    }

    filterJobs(text) {
        this.setState({text});
        text = text.toLowerCase();
        const jobsToView = this.state.jobs.filter(job => job.id.toString().match(text) || job.title.toLowerCase().match(text) || job.location.toLowerCase().match(text));
        this.setState({jobsToView});
    }

    render() {
        const {jobsToView} = this.state;

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={(text) => this.filterJobs(text)}
                    value={this.state.text}
                    placeholder={'Search by job ID or description'}
                    underlineColorAndroid={'#d8d8d8'}
                    placeholderTextColor={'#979797'}
                />
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                    style={styles.list}
                    data={jobsToView}
                    renderItem={({item}) => <JobCell job={item} showDetails={this.showDetails.bind(this)}/>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}
