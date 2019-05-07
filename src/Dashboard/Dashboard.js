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
            endpoint: "localhost:1235"
        };


        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const socket = io(this.state.endpoint);

        socket.on('CLOSE_QUESTION', () => {

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

    getQuestion() {
        const socket = io(this.state.endpoint);

       // var str = "";
        fetch('http://bonddemo.tk/v1/question/render-question?difficulty=3', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {
            console.log(response);
            //response.body = JSON.parse(response.body);
           // str.concat(response.title);
            $('#question-area').html(response.title);

            //emit question to server node
            socket.emit('GO_TO_GET_QUESTION');
        })
        .catch(error => console.log(error));
    }

    Todo1() {
        fetch('http://bonddemo.tk/v1/question/render-question?difficulty=3', {
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


    Todo2() {
        fetch('http://bonddemo.tk/v1/question/request-question-node', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
        })
        .then(res => res.json())
        .then(response => {
            console.log(response)
        })
        .catch(error => console.log(error));
    }

    Todo3() {
        var form = new FormData();
        form.append('email', 'user@example.com');
        form.append('answer', 'A');

        fetch('http://bonddemo.tk/v1/question/check-answer', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                'Content-Type': 'text/plain'
            },
            body: form
        })
        .then(res => {
            res.json().then(response => {
                console.log(response);
            })
        })
        .catch(error => console.log(error));
    }


    Todo4() {
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
    }


    render() {
        return (
            <div>
                <WebRTCVideo></WebRTCVideo>
                <Button onClick={() => this.getQuestion()}>Get Question</Button>
                <Button onClick={() => this.Todo1()}>Test 1</Button>
                <Button onClick={() => this.Todo2()}>Test 2</Button>
                <Button onClick={() => this.Todo3()}>Test 3</Button>
                <Button onClick={() => this.Todo4()}>Test 4</Button>
                <div id="question-area"></div>
            </div>
        );
    }
}