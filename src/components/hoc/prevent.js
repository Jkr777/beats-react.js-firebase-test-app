import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

const prevent = WrappedComp => {
  class Prevent extends Component {

    render() {
      return this.props.auth.isAuth 
                                    ? <Redirect to="/dashboard" />
                                    : <WrappedComp { ...this.props } />
    }
  } 
  const mapStateToProps = state => {
    return { auth: state.auth }
  };

  return connect(mapStateToProps)(Prevent);
} 

export default prevent;