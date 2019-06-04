import WebRTCVideo from '../WebRTC/WebRTC';
import React from 'react';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import io from 'socket.io-client';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import { FaUserAlt, FaCat, FaYoutube, FaEnvelope, FaFacebookF } from 'react-icons/fa';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.socket = io("localhost:1235");
        // this.socket = io("103.89.85.105:1235");
        this.state = {
            id: '',
            program_id: 1,
            isDisabled: true
        };
    }

    componentDidMount() {
        this.socket.on('CLOSE_QUESTION', () => {
            this.setState({ isDisabled: false });
        });

        this.socket.on("SERVER_CHAT", (data) => {
            $("#content").append("<div style='color:#008afc; font-weight: 650; font-size: 23px'>" + data[1] + ": <span style='color:#000; font-size: 18px'>" + data[0] + "</span></div>");
            $('.chat-main').animate({ scrollTop: $('.chat-main').get(0).scrollHeight }, 200);
        });


        this.socket.on("STATISTIC", (statistic) => {
            $('#summary-correct').html(statistic.right);
            $('#summary-incorrect').html(statistic.wrong);
        });


        this.socket.on("RESPONSE_ANSWER_TO_CLIENT", (data) => {
            $('#correct-answer').html(data.response.answer);
        });

        this.socket.on('END_GAME_TO_CLIENT', (dataEndGame) => {
            console.log(dataEndGame);
           var data = new FormData();
           data.append('data', JSON.stringify(dataEndGame))
            fetch('http://bonddemo.tk/v1/question/end-game',{
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer lyWyy7-2EqXt6JOjKXnQV90Ghv94ie_5vO20rHFP',
                },
                body: data
            })
            .then(res => {
                res.json().then(response => {
                    console.log(response);
                })
            })
            .catch(error => {console.log(error);});
        });
    }


    startGame() {
        this.socket.emit('START_GAME');

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
            $('#correct-answer').html("");

            // $('.act').addClass('act-not-full');    
            // $('.question').show();
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
        $(document).ready(function() {
            var chat_summary = 0;
            var h = 0;
            var temp = 0;
            var h1 = 0;
            

            function calcSize() {
                h1 = $(document).height() - $('.main-container').height() - $('.footer').height();
                temp = $(document).height() - $('.footer').height() - $(window).height();
                
                if(temp >= 0) {
                    chat_summary = $(window).height() - 50 - h1;
                    h = temp;
                } else {
                    chat_summary = $(document).height() - 50 - $('.footer').height() - h1;
                    h = 0;
                    var chat_content = chat_summary - 180;
                    // var chat_main = (chat_summary - 180)*0.7;
                    var chat_main = chat_content - $('.chat-title').height();
                    $('.chat-main').css({'height':((chat_main))+'px'});
                }
                $('.chat-content').css({'height': '100%'});
                $('.chat-summary').css({'height':((chat_summary))+'px'});
            }

            calcSize();
            setTimeout(calcSize, 1500);
            $(window).bind('resize', calcSize);

            $(window).bind("scroll", function(e) {
                var scroll_y = h;
                $('.right-1').removeClass('end');
                if(temp >= 0) {
                    var top = $(window).scrollTop();
                    $(".right-1").addClass("fix-box");
                    $(".chat-summary").addClass("fix-box");
                    $(".right-1").addClass("start");
                    $('.right-1').removeClass('end');
                    if (top >= scroll_y) {
                        $(".right-1").removeClass("fix-box");
                        $(".chat-summary").removeClass("fix-box");
                        $(".right-1").addClass("end");
                    } 
                } else {
                    $(".right-1").removeClass("fix-box");
                        $(".chat-summary").removeClass("fix-box");
                }
                           
            });
            
        });
        return (
            <div className="container-full">
                <div className="header" style={{ width: '100%' }}>
                    <Navbar bg="dark" expand="lg">
                        <Navbar.Brand href="#home" style={{ color: '#008afc', marginTop: '-5px', position: 'absolute', left: '0'}}><FaCat style={{ fontSize: '22px'}} /> &nbsp;Trivia Game</Navbar.Brand>
                        <NavDropdown title={<FaUserAlt style={{ fontSize: '20px'}} />} id="basic-nav-dropdown" style={{position: 'absolute', right: '20px'}}>
                            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" onClick={() => this.logout()}>Log out</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar>
                </div>
                <div className="main-container">
                    <div className="left">
                        <div className="main">
                            <div className="main-content">
                                <div className="head-title">LIVE STREAM TRIVIA GAME</div>
                                <div className="video">
                                    <WebRTCVideo style={{width: '100%'}}></WebRTCVideo>
                                </div>
                            </div>
                        </div>
                        <div className="act-question">
                            <div className="act act-not-full">
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
                        </div>
                    </div>

                    <div className="right">
                        <div className="right-1">
                            <div className="chat-summary">
                                <div className="summary">
                                    <div className="summary-title">SUMMARY</div>
                                    <div>
                                        <label>Total correct: &emsp;</label>
                                        <span id="summary-correct" className="float-right"></span>
                                    </div>
                                    <div>
                                        <label>Total incorrect: &emsp;</label>
                                        <span id="summary-incorrect" className="float-right"></span>
                                    </div>
                                    <div style={{marginBottom: '10px'}}>
                                        <label>Correct answer: &emsp;</label>
                                        <span id="correct-answer" className="float-right"></span>
                                    </div>
                                </div>
                                <div className="chat-content" style={{width: '100%'}}>
                                    <div>
                                        <div className="chat-title">COMMENT</div>
                                        <div className="chat-main">
                                            <div id="content"></div>
                                        </div>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer">
                    <div style={{margin: '20px 10% 0 10%'}}>
                        <MDBFooter className="font-small pt-4 mt-4">
                            <MDBContainer fluid className="text-center text-md-left">
                            <MDBRow>
                                <MDBCol md="4">
                                    <h5 className="title">TRIVIA GAME</h5>
                                    <ul className="w3_footer_grid_list" style={{padding: '0', background: 'transparent'}}>
                                        <li className="list-unstyled">
                                            <a href="#!">Home</a>
                                        </li>
                                        <li className="list-unstyled">
                                            <a href="#!">About</a>
                                        </li>
                                        <li className="list-unstyled">
                                            <a href="#!">Contact</a>
                                        </li>
                                    </ul>
                                </MDBCol>
                                <MDBCol md="4">
                                    <h5 className="title">CONTACT</h5>
                                    <ul style={{padding: '0', background: 'transparent'}}>
                                        <li className="list-unstyled">
                                            <a href="#!"><FaYoutube/>&nbsp; Trivia Game</a>
                                        </li>
                                        <li className="list-unstyled">
                                            <a href="#!"><FaEnvelope/>&nbsp; abc@gmail.com</a>
                                        </li>
                                        <li className="list-unstyled">
                                            <a href="#!"><FaFacebookF/>&nbsp; Trivia Game</a>
                                        </li>
                                    </ul>
                                </MDBCol>

                                <MDBCol md="4">
                                    <h5 className="title">MOBILE APPS</h5>
                                    <ul style={{padding: '0', background: 'transparent'}}>
                                        <li className="list-unstyled">
                                            <a href="#!">
                                                <div>
                                                    <img src="/Google_Play.svg" className="img-responsive"/>
                                                </div>
                                            </a>
                                        </li>
                                        <li className="list-unstyled">
                                            <a href="#!">
                                                <div>
                                                    <img src="/app.png" className="img-responsive"/>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </MDBCol>
                            </MDBRow>
                            </MDBContainer>
                            <div className="footer-copyright text-center py-3" style={{background: '#343a40', borderTop: '1px solid #999'}}>
                                <MDBContainer fluid>
                                    &copy; {new Date().getFullYear()} Copyright: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
                                </MDBContainer>
                            </div>
                        </MDBFooter>
                    </div>
                </div>
            </div>
        );
    }
}