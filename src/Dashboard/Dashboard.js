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
        // this.socket = io("localhost:1235");
        this.socket = io("103.89.85.105:1235");
        this.state = {
            id: '',
            program_id: 1,
            isDisabled: true
        };
    }

    componentDidMount() {
        $('.question').hide();
        this.socket.on('CLOSE_QUESTION', () => {
            this.setState({ isDisabled: false });
        });

        this.socket.on("SERVER_CHAT", (data) => {
            $("#content").append("<div style='color:#008afc; font-weight: 600; font-size: 20px'>" + data[1] + ": <span style='color:#000; font-size: 18px'>" + data[0] + "</span></div>");
            // $('#content').append("<style>#content:before{content:'' !important}</style>");
            $('.chat-main').animate({ scrollTop: $('.chat-main').get(0).scrollHeight }, 200);
        });


        this.socket.on("MC_STATISTIC", (statistic) => {
            $('#summary-correct').html(statistic[0]);
            $('#summary-incorrect').html(statistic[1]);
        });


        this.socket.on("RESPONSE_ANSWER_TO_CLIENT", (response) => {
            $('#correct-answer').html(response.answer);
        });
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
            $('#correct-answer').html("");

            $('.act').addClass('act-not-full');    
            $('.question').show();
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
        $('.act').removeClass('act-not-full');    
        $('.question').hide();
    }


    render() {
        $(document).ready(function() {
            $(window).bind("scroll", function(e) {
                var scroll_y = $(document).height() - 50 - $('.footer').height() - $('.chat-summary').height() - 20;
                var top = $(window).scrollTop();
                $(".right-1").addClass("fix-box");
                $(".chat-summary").addClass("fix-box");
                $(".right-1").addClass("start");
                $('.right-1').removeClass('end');
                if (top > scroll_y) {
                    $(".right-1").removeClass("fix-box");
                    $(".chat-summary").removeClass("fix-box");
                    $(".right-1").addClass("end");
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
                            <img src="/bg2.jpg" style={{width: '100%'}}/>
                            <div className="main-content">
                                <div className="head-title">LIVE STREAM TRIVIA GAME</div>
                                <div className="video">
                                    <WebRTCVideo style={{width: '100%'}}></WebRTCVideo>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{width: '100%', height: '50px', marginTop: '10px', textAlign: 'center'}}>
                            <img src="/line.png" alt="" className="line" style={{height: '50px'}}/>
                        </div> */}
                        <div className="act-question">
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
                                {/* <div style={{ border: 'none', borderBottom: '1px solid #333', marginBottom: '15px' }}></div> */}
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