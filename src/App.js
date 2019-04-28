import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import Signup from './User/Signup';
import Login from './User/Login';
import Dashboard from './Dashboard/Dashboard';
import { PrivateRoute } from './PrivateRoute';
import { createBrowserHistory } from 'history';
// import './App.css';

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <div className="col-sm-12">
        <Router history={history}>
          <div>
            {/* <ul>
              <div>
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/live">Cấu hình stream</Link></li>
              </div>
              <li style={{ float: 'right' }}><Link to="/login">Đăng xuất</Link></li>
            </ul> */}
            <div className="col-sm-8 col-sm-offset-2">
              <Switch>
                {/* <PrivateRoute exact path="/" component={Dashboard} /> */}
                <Route path="/" component={Dashboard} />
                {/* <Route path="/login" component={Login} /> */}
                {/* <Route path="/signup" component={Signup} /> */}
                {/* <Route component={NotFoundPage} /> */}
              </Switch>
            </div>
          </div>
        </Router >
      </div >
    );
  }
}

export default App;
