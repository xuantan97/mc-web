import WebRTCVideo from '../WebRTC/WebRTC';
import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import io from 'socket.io-client';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io("localhost:1235");
        //this.socket = io("103.89.85.105:1235");
        this.state = { 
            value: '' ,
            id: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
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
                $('#summary-correct').html(response.correct);
                $('#summary-incorrect').html(response.incorrect);
            })
            .catch(error => console.log(error));

        });

        this.socket.on("SERVER_CHAT", (data) => {
            $("#content").append("<div style='color:#ff0'>"+ data[1] + ": <span style='color:white'>"+ data[0] +"</span></div>");
            $('#content').append("<style>#content:before{content:'' !important}</style>");
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
            // $('#correct-answer-area').html("Correct: " + response.answer);

            $('#summary-correct').html("");
            $('#summary-incorrect').html("");

        })
        .catch(error => console.log(error));
    }


    getQuestionClient() {
        //emit question to server node
        this.socket.emit('GO_TO_GET_QUESTION');
    }


    responseAnsewer() {
        this.socket.emit('RESPONSE_ANSWER_TO_NODE');
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
            <div className="container-full">
                <WebRTCVideo></WebRTCVideo>
                <div className="act">
                    <Button onClick={() => this.startGame()}>Start Game</Button>
                    <Button onClick={() => this.getQuestionMC()}>Get Question MC</Button>
                    <Button onClick={() => this.getQuestionClient()}>Get Question Client</Button>
                    <Button onClick={() => this.responseAnsewer()}>Response answer</Button>
                    <Button onClick={() => this.endGame()}>End Game</Button>
                </div>
               <div className="question">
                    <div className="question-1">
                            <div id="question-area">Q: </div>
                            <div className="answer" id="answer-A-area">A. </div>
                            <div className="answer" id="answer-B-area">B. </div>
                            <div className="answer" id="answer-C-area">C. </div>
                            {/* <div id="correct-answer-area"></div> */}
                    </div>
                </div>
                <br/>
                

                <div className="chat-content">
                    {/* <p>Content chat</p> */}
                    <div id="content">
            
                    </div>
                </div>

                <div className="summary">
                    <div className="summary-1" style={{fontSize: '30px', fontWeight: '700'}}>
                        <div>
                            <label>Total correct: &emsp;</label>
                            <span id="summary-correct" style={{float: 'right'}}></span>
                        </div>
                        <div>
                            <label>Total incorrect: &emsp;</label>
                            <span id="summary-incorrect" style={{float: 'right'}}></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}