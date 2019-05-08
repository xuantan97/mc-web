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
            id: ''
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    socket = io("103.89.85.105:1235");

    componentDidMount() {

        this.socket.on('CLOSE_QUESTION', () => {
            console.log("CLOSE_QUESTION");

            fetch('http://bonddemo.tk/v1/question/summary-question?id=' + this.state.id, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                    'Content-Type': 'text/plain'
                },
            })
            .then(res => res.json())
            .then(response => {
                console.log(response);
                $('#summary-correct').html("Total correct: " + response.correct);
                $('#summary-incorrect').html("Total Incorrect: " + response.incorrect);
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
        fetch('http://bonddemo.tk/v1/user/start-game', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
            },
        })
        .then(res => res.json())
        .then(response => {
            console.log(response)
        })
        .catch(error => console.log(error));
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
            this.setState({id: response.id});
            response.body = JSON.parse(response.body);
            
            console.log(response);
            $('#question-area').html(response.title);
            $('#answer-A-area').html("A. " + response.body.A );
            $('#answer-B-area').html("B. " + response.body.B );
            $('#answer-C-area').html("C. " + response.body.C );
            $('#correct-answer-area').html("Correct: " + response.answer);

            $('#summary-correct').html("");
            $('#summary-incorrect').html("");

        })
        .catch(error => console.log(error));
    }


    getQuestionClient() {
        //emit question to server node
        this.socket.emit('GO_TO_GET_QUESTION');
    }

    endGame() {
        fetch('http://bonddemo.tk/v1/question/end-game', {
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
    }
   


    render() {
        return (
            <div>
                <WebRTCVideo></WebRTCVideo>
                <Button onClick={() => this.startGame()}>Start Game</Button>
                <Button onClick={() => this.getQuestionMC()}>Get Question MC</Button>
                <Button onClick={() => this.getQuestionClient()}>Get Question Client</Button>
                <Button onClick={() => this.endGame()}>End Game</Button>
               
                <div id="question-area"></div>
                <div id="answer-A-area"></div>
                <div id="answer-B-area"></div>
                <div id="answer-C-area"></div>
                <div id="correct-answer-area"></div>
                <br/>
                <div id="summary-correct"></div>
                <div id="summary-incorrect"></div>
            </div>
        );
    }
}