import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <div>
            <div>
              <Switch>
                <Route path="/" component={Dashboard} />
              </Switch>
            </div>
          </div>
        </Router >
      </div >
    );
  }
}

export default App;
