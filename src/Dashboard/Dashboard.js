import WebRTCVideo from '../WebRTC/WebRTC';
import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import io from 'socket.io-client';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        // this.socket = io("localhost:1235");
        this.socket = io("103.89.85.105:1235");
        this.state = {
            value: '',
            id: '',
            program_id: 1,
            isDisabled: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

        this.socket.on('CLOSE_QUESTION', () => {
            this.setState({ isDisabled: false });
        });

        this.socket.on("SERVER_CHAT", (data) => {
            $("#content").append("<div style='color:#ff0'>" + data[1] + ": <span style='color:white'>" + data[0] + "</span></div>");
            $('#content').append("<style>#content:before{content:'' !important}</style>");
        });


        this.socket.on("MC_STATISTIC", (statistic) => {
            console.log(statistic);
            console.log("Right: " + statistic[0]);
            console.log("Wrong: " + statistic[1]);
            $('#summary-correct').html(statistic[0]);
            $('#summary-incorrect').html(statistic[1]);
        });


        this.socket.on("RESPONSE_ANSWER_TO_CLIENT", (response) => {
            $('#correct-answer').html(response.answer);
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
        this.setState({ program_id: 1 });
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
        console.log(this.state.program_id);
        fetch('http://bonddemo.tk/v1/question/render-question-program?sttQuestion=' + this.state.program_id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {
            this.setState({
                id: response.id,
            });
            response.body = JSON.parse(response.body);

            console.log(response);
            $('#question-area').html(response.title);
            $('#answer-A-area').html("A. " + response.body.A);
            $('#answer-B-area').html("B. " + response.body.B);
            $('#answer-C-area').html("C. " + response.body.C);

            $('#summary-correct').html("");
            $('#summary-incorrect').html("");

        })
        .catch(error => console.log(error));
    }


    getQuestionClient() {
        this.socket.emit('GO_TO_GET_QUESTION', this.state.program_id);
    }


    responseAnsewer() {
        this.socket.emit('RESPONSE_ANSWER_TO_NODE', this.state.program_id);
        this.setState({
            program_id: this.state.program_id + 1,
            isDisabled: true
        });
    }


    endGame() {
        this.socket.emit('END_GAME');
    }


    render() {
        return (
            <div className="container-full">
                <WebRTCVideo></WebRTCVideo>
                <div className="act">
                    <Button onClick={() => this.startGame()}>Start Game</Button>
                    <Button onClick={() => this.getQuestionMC()}>Get Question MC</Button>
                    <Button onClick={() => this.getQuestionClient()}>Get Question Client</Button>
                    <Button onClick={() => this.responseAnsewer()} disabled={this.state.isDisabled}>Response answer</Button>
                    <Button onClick={() => this.endGame()}>End Game</Button>
                </div>
                <div className="question">
                    <div className="question-1">
                        <div id="question-area">Q: </div>
                        <div className="answer" id="answer-A-area">A. </div>
                        <div className="answer" id="answer-B-area">B. </div>
                        <div className="answer" id="answer-C-area">C. </div>
                    </div>
                </div>
                <br />


                <div className="chat-content">
                    {/* <p>Content chat</p> */}
                    <div id="content">

                    </div>
                </div>

                <div className="summary">
                    <div className="summary-1" style={{ fontSize: '30px', fontWeight: '700' }}>
                        <div>
                            <label>Total correct: &emsp;</label>
                            <span id="summary-correct" style={{ float: 'right' }}></span>
                        </div>
                        <div>
                            <label>Total incorrect: &emsp;</label>
                            <span id="summary-incorrect" style={{ float: 'right' }}></span>
                        </div>
                        <div>
                            <label>Correct answer: &emsp;</label>
                            <span id="correct-answer" style={{ float: 'right' }}></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}