import React, { Component } from 'react';
import { render } from 'react-dom';
import { Link, HashRouter, BrowserRouter, withRouter, Route, NavLink, Switch } from 'react-router-dom';
import Bundle from './Bundle';

class RoutesConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  MainEntry = (props) => {
    return(
      <Bundle modId="entry" load={() => import('../Component/MainEntry')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  Login = (props) => {
    return(
      <Bundle modId="login" load={() => import('../Component/Login')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  Register = (props) => {
    return(
      <Bundle modId="register" load={() => import('../Component/Register')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  DefaultIndexList = (props) => {
    return(
      <Bundle modId="listByDate" load={() => import('../Component/DefaultIndexList')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  CreateBook = (props) => {
    return(
      <Bundle modId="bookCreated" load={() => import('../Component/CreateBook')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  Me = (props) => {
    return(
      <Bundle modId="me" load={() => import('../Component/Me')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  BookDetailedInfo = (props) => {
    return(
      <Bundle modId="bkDetails" load={() => import('../Component/BookDetailedInfo')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  MyBuyers = (props) => {
    return(
      <Bundle modId="myBuyers" load={() => import('../Component/MyBuyers')}>
      {(Container) => <Container {...props}/>}
      </Bundle>
    );
  }

  render() {
    return(
      <HashRouter>
        <div className="route">
          <Switch>
            <Route exact path="/" component={this.MainEntry}/>
            <Route exact path="/log_in" component={this.Login}/>
            <Route exact path="/register" component={this.Register}/>
            <Route exact path="/default_index_list/:uid/:search" component={this.DefaultIndexList}/>
            <Route exact path="/bk_detailed_info/:uid/:bkid/:scl_major" component={this.BookDetailedInfo}/>
            <Route exact path="/book_publish/:uid" component={this.CreateBook}/>
            <Route exact path="/me/:uid" component={this.Me}/>
            <Route exact path="/my_buyers/:uid" component={this.MyBuyers}/>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default RoutesConfig;
