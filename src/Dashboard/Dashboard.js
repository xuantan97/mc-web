import WebRTCVideo from '../WebRTC/WebRTC';
import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import io from 'socket.io-client';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            value: '' ,
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    socket = io("103.89.85.105:1235");

    componentDidMount() {

        this.socket.on('CLOSE_QUESTION', () => {

            fetch('http://bonddemo.tk/v1/question/summary-question', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                    'Content-Type': 'text/plain'
                },
            })
            .then(res => res.json())
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));

        });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }

    startGame() {
        this.socket.emit("START_GAME");
    }

    getQuestionMC() {
        fetch('http://bonddemo.tk/v1/question/render-question?difficulty=3', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {
            response.body = JSON.parse(response.body);
            
            console.log(response);
            $('#question-area').html(response.title);
            $('#answer-A-area').html("A. " + response.body.A );
            $('#answer-B-area').html("B. " + response.body.B );
            $('#answer-C-area').html("C. " + response.body.C );
            $('#correct-answer-area').html("Correct: " + response.answer);

        })
        .catch(error => console.log(error));
    }


    getQuestionClient() {
        //emit question to server node
        this.socket.emit('GO_TO_GET_QUESTION');
    }

   


    render() {
        return (
            <div>
                <WebRTCVideo></WebRTCVideo>
                <Button onClick={() => this.startGame()}>Start Game</Button>
                <Button onClick={() => this.getQuestionMC()}>Get Question MC</Button>
                <Button onClick={() => this.getQuestionClient()}>Get Question Client</Button>
               
                <div id="question-area"></div>
                <div id="answer-A-area"></div>
                <div id="answer-B-area"></div>
                <div id="answer-C-area"></div>
                <div id="correct-answer-area"></div>
            </div>
        );
    }
}