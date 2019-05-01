import React from "react";
import Peer from "peerjs";
import * as $ from "jquery";
import io from 'socket.io-client';

class WebRTCVideo extends React.Component {
    PEER_SERVER = { host: '103.89.85.105', port: '1234', path: '/peerjs', key: 'peerjs', };
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            token: '',
        };
        this.videoTag = React.createRef();
        // this.userMedia;
    }
    // server = "103.89.85.105:1234/";
    async componentDidMount() {
        let getUserMediaTest = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator)

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(stream => { 
                 this.handleStream(stream);
            })
            .catch(e => console.log(e.message));
    }
    handleStream(stream) {
        var socket = io.connect('http://103.89.85.105:1321', {transports : ['websocket']});

        //set video ne
        this.videoTag.current.srcObject = stream;
        var peer = new Peer(this.PEER_SERVER);

        peer.on('open', function () {
            console.log(peer.id);
            $('#my-id').text(peer.id);
            socket.emit('broadcastID', peer.id);
        });
        peer.on('connection', function (dataCon) {
            console.log('Peer wanting to connect!', dataCon.peer);
            var call = peer.call(dataCon.peer, stream);
            dataCon.send(stream)
        });
        var conn = peer.connect('mc-id');
        conn.on('open', function () {
            console.log('connection opened, ' + peer.id);
            conn.on('data', function (data) {
                console.log('data received: ');
                $('#broadcast-video').prop('src', URL.createObjectURL(data));
            });
        });
        peer.on('call', function (call) {
            call.answer();
            call.on('stream', function (stream) {
                $('#broadcast-video').prop('src', URL.createObjectURL(stream));
            });
        });
    }



    render() {
        return (<section>
            <video id={this.props.id}
                ref={this.videoTag}
                width={this.props.width}
                height={this.props.height}
                autoPlay
                title={this.props.title}></video>
            <div id="my-id"></div>
        </section >)
    }
}

export default WebRTCVideo;