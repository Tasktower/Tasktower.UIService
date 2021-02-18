import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './shared/outline/Layout';
import { Home } from './home/Home';
import { FetchData } from './fetchdata/FetchData';
import { Counter } from './counter/Counter';
import Profile from './profile/Profile'

import './styles.scss'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data' component={FetchData} />
        <Route path='/profile' component={Profile} />
      </Layout>
    );
  }
}
