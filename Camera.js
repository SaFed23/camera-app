import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, PermissionsAndroid, Platform} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/FontAwesome';
import CameraRoll from "@react-native-community/cameraroll";

class Camera extends React.Component {
    state = {
        light: "off",
        typeOfCamera: "back",
        statusOfVideo: "",
        functionality: "photo"
    }

    hasAndroidPermission = async () => {
        const writePermission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        const hasWritePermission = await PermissionsAndroid.check(writePermission);
        const hasReadPermission = await PermissionsAndroid.check(readPermission);
        if (hasWritePermission && hasReadPermission) {
            return true;
        }

        const statusWrite = await PermissionsAndroid.request(writePermission);
        const statusRead = await PermissionsAndroid.request(readPermission);
        return statusWrite === 'granted' && statusRead === 'granted';
    }

    save = async (uri) => {
        if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
            return;
        }
        CameraRoll.save(uri)
            .then(res => console.log(res))
            .catch(err => console.log(err.message));
    };

    onTakePicture = () => {
        this.camera.takePictureAsync()
            .then(data => {
                this.save(data.uri)
                    .then()
                this.setState({path: data.uri})
            })
            .catch(err => console.log(err.message));
    };

    onStartVideo = () => {
        this.setState({
            statusOfVideo: "process",
        });
        this.camera.recordAsync()
            .then(data => {
                this.save(data.uri)
                    .then();
            });
    }

    onStopVideo = () => {
        this.setState({
            statusOfVideo: "",
        });
        this.camera.stopRecording();
    }

    onChangeCamera = () => {
        this.setState({
            typeOfCamera: this.state.typeOfCamera === "back" ? "front" : "back",
        });
    }

    onChangeLight = () => {
        const types = ["off", "on", "auto"];
        let currentIndex = types.indexOf(this.state.light);
        if(currentIndex === 2){
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        this.setState({
            light: types[currentIndex],
        });
    }

    onChangeFunctionality = () => {
        this.setState({
            functionality: this.state.functionality === "photo" ? "video" : "photo",
        });
    }

    renderCamera() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: "column", width: 60}}>
                        <TouchableOpacity onPress={this.onChangeLight} style={styles.changeLight}>
                            <View style={{marginLeft: 3}}>
                                <Icon name={"bolt"} size={30} color={"white"}/>
                            </View>
                            <Text style={{color: "white"}}>{this.state.light}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <RNCamera
                    ref={cam => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type[this.state.typeOfCamera]}
                    flashMode={RNCamera.Constants.FlashMode[this.state.light]}
                    zoom={0.2}
                >
                </RNCamera>
                {this.state.functionality === "photo" ?
                    (<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={this.onChangeCamera} style={styles.changeCamera}>
                            <Icon name={"undo"} size={30} color={"white"}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onTakePicture} style={styles.capture}/>
                        <TouchableOpacity onPress={this.onChangeFunctionality} style={styles.changeCamera}>
                            <Icon name={"film"} size={30} color={"white"}/>
                        </TouchableOpacity>
                    </View>) :
                    (<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={this.onChangeCamera}
                                style={styles.changeCamera}
                                disabled={this.state.statusOfVideo}
                            >
                                <Icon name={"undo"} size={30} color={this.state.statusOfVideo ? "black" : "white"}/>
                            </TouchableOpacity>
                            {this.state.statusOfVideo === "" ? (
                                <TouchableOpacity onPress={this.onStartVideo} style={styles.video}/>
                            ) : (
                                <TouchableOpacity onPress={this.onStopVideo} style={styles.video}>
                                    <View style={{marginTop: 14, marginLeft: 16}}>
                                        <Icon name={"stop"} size={25} color={"white"}/>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={this.onChangeFunctionality}
                                style={styles.changeCamera}
                                disabled={this.state.statusOfVideo}
                            >
                                <Icon name={"camera"} size={30} color={this.state.statusOfVideo ? "black" : "white"}/>
                            </TouchableOpacity>
                            </View>
                        )
                }

            </View>
        );
    }

    renderImage() {
        return (
            <View style={{width: 400, height: 700}}>
                <ImageBackground
                    source={{ uri: this.state.path }}
                    style={styles.preview}
                />
                <Text
                    style={[styles.cancel, {fontSize: 50, color: "red"}]}
                    onPress={() => this.setState({ path: null })}
                >Cancel
                </Text>
            </View>
        );
    }

    render() {
        console.log(this.state.statusOfVideo);
        return (
            <View style={styles.container}>
                {this.state.path ? this.renderImage() : this.renderCamera()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        backgroundColor: 'white',
        borderRadius: 1000,
        width: 60,
        height: 60,
        alignSelf: 'center',
    },
    statusOfVideo: {
        width: 30,
        height: 30,
        alignSelf: 'center',
    },
    video: {
        backgroundColor: 'red',
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 1000,
        width: 60,
        height: 60,
        alignSelf: 'center',
    },
    changeCamera: {
        width: 80,
        height: 60,
        padding: 15,
        paddingHorizontal: 20,
        margin: 20,
    },
    headerBar: {
        height: 80,
    },
    changeLight: {
        width: 30,
        height: 50,
        margin: 20,
    },

});

export default Camera;

