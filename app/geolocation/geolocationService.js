import {Location, Permissions} from 'expo';
import {locals} from '../../env.dev';
import {AsyncStorage} from 'react-native';
import {store} from '../redux/storeOffline'

let watchingObs = null;
const token = null;
export const startMonitoringLocationAsync = () => {
    processFunctionWithLocationPermissionGranted(watchLocation);
};

let watchLocation = () => {
    watchingObs = Location.watchPositionAsync({
        enableHighAccuracy: true,
        timeInterval: 100,
        distanceInterval: 50
    }, sendLocationNoJob);
};

let sendLocationNoJob = ({coords}) => {
    store.dispatch(sendGeolocation(getCoordsObj(coords)));
};

export const sendCurrentLocation = (jobId, statusId) => {
    processFunctionWithLocationPermissionGranted(currentLocation, [jobId, statusId]);
};

let currentLocation = async (jobId, statusId) => {
    let {coords} = await Location.getCurrentPositionAsync({});
    sendLocationWithJob(coords, jobId, statusId);
};

let sendLocationWithJob = (coords, jobId, statusId) => {
    store.dispatch(sendGeolocation(Object.assign(getCoordsObj(coords), {
        job: {id: jobId},
        status: {id: statusId}
    })));
    startMonitoringLocationAsync();
};

let processFunctionWithLocationPermissionGranted = async (callback, args) => {
    if(!this.token) this.token = await AsyncStorage.getItem('token');
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
        callback.apply(this, args);
    }
};

const sendGeolocation = body => ({
    type: 'SEND_GEOLOCATION',
    payload: {body},
    meta: {
        offline: {
            effect: {
                url: locals.apiHost + `assignee/location`,
                headers: {'Authorization': 'Bearer ' + this.token},
                method: 'POST',
                body: JSON.stringify(body)
            },
        }
    }
});

let sendLocation = async (body) => {
    console.log(body);
    fetch(locals.apiHost + `assignee/location`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: new Headers({
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
            'Content-Type': 'application/json'
        })
    })
};

let getCoordsObj = (coords) => {
    return {
        latitude: coords.latitude,
        longitude: coords.longitude,
        date: getCurrentDate()
    };
};

let getCurrentDate = () => new Date().toString().slice(0, 24);


export const stopMonitoring = () => {
    if (watchingObs) {
        watchingObs.remove();
    }
};

export const isWatching = () => !watchingObs;
