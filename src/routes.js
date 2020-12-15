import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ToastsComponent from "./utils/toasts";
import { connect } from 'react-redux';
import { autoSignIn, logOut } from "./store/actions";

import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import Contact from "./components/contact";

class Routes extends Component {

  componentDidMount() {
    this.props.dispatch(autoSignIn());
  }

  handleLogOut = () => this.props.dispatch(logOut());

  app = auth => (
    <BrowserRouter>
        <Header auth={auth} logOut={this.handleLogOut}/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/contact" exact component={Contact} />
          </Switch>
        <Footer />
        <ToastsComponent />
      </BrowserRouter>
  );

  render() {
    const { auth } = this.props;
    return auth.checkingAuth ? this.app(auth) : '...loading';// ast e prop default false
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Routes);