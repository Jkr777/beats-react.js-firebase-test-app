import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";
import Login from "./components/login";
import Contact from "./components/contact";

class Routes extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
          <Switch>
            <Route to="/" component={Home} exact />
            <Route to="/login" component={Login} exact />
            <Route to="/contact" component={Contact} exact />
          </Switch>
        <Footer />
      </BrowserRouter>
    )
  }
}

export default Routes;