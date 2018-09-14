import * as React from "react/cjs/react.development";
import {TextInput, View, AsyncStorage, Alert, Vibration, Text, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import * as Geolocation from "../geolocation/geolocationService";
import {locals} from "../../env.dev";
import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
    container: {
        height: '100%',
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '90%',
        marginLeft: '5%',
    },
    inputContainer: {
        borderColor: '#848484',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: '1.5rem'
    },
    textInput: {
        height: '2rem',
        borderBottomWidth: 0
    },
    form: {
        padding: 20,
        marginTop: '-1%'
    },
    h1: {
        textAlign: 'center',
        fontSize: '4rem',
        fontWeight: '600',
        color: '#474d5a'
    },
    h2: {
        textAlign: 'center',
        color: '#474d5a',
        fontSize: '1.5rem',
        fontWeight: '200'
    },
    button: {
        height: '3.5rem',
        backgroundColor: '#ff473d',
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1.2rem'
    }
});

export default class Login extends React.Component {

    username = '';
    password = '';

    constructor(props) {
        super(props);
    }

    async componentWillMount(){
        if(await AsyncStorage.getItem('token')) {
            Actions.reset('jobs');
            Geolocation.startMonitoringLocationAsync();
        }
    }

    logIn() {
        fetch(locals.apiHost + 'auth/', {
            method: 'post',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({password: this.password, username: this.username})
        })
            .then(res => res.json())
            .then(res => {
                if (res.token) {
                    AsyncStorage.setItem('token', res.token);
                    Geolocation.startMonitoringLocationAsync();
                    Actions.reset('jobs');
                } else {
                    Alert.alert(
                        'Incorrect username or password',
                        'Please enter a valid username and password');
                    Vibration.vibrate(50, true);
                }
            })
            .catch(res => {
                Alert.alert(
                    'Incorrect username or password',
                    'Please enter a valid username and password');
                Vibration.vibrate(50, true);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Text style={styles.h1}>Courier</Text>
                    <Text style={styles.h2}>Delivery Service</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.textInput}
                                   underlineColorAndroid={'rgba(0,0,0,0)'}
                                   placeholder="Username"
                                   autoCapitalize="none"
                                   onChangeText={(username) => {
                                       this.username = username
                                   }}>
                        </TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            underlineColorAndroid={'rgba(0,0,0,0)'}
                            style={styles.textInput}
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(password) => this.password = password}>
                        </TextInput>
                    </View>
                    <TouchableOpacity onPress={() => this.logIn()}
                                      style={styles.button}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{color: '#6f6f70', fontWeight: 'bold', textAlign:'center', marginBottom: 10}}>
                        Please visit our website to register at the service
                    </Text>
                    <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                        Terms of Service
                    </Text>
                </View>
            </View>
        )
    }
}
