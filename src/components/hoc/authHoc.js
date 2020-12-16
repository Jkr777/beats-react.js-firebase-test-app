import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";

const authHoc = (WrappedComp, isAdmin = false) => {
  class AuthHoc extends Component {

    authCheck = () => {
      const auth = this.props.auth;

      if(auth.isAuth) {
        const role = auth.user.role;
        if(role === 1 && isAdmin) {
          return <Redirect to="/dashboard" />
        }
        return <WrappedComp { ...this.props }/> // psam props ce vin apsate din Route

      } else {
        return <Redirect to="/login" />
      }
    }

    render() {
      return this.authCheck();
    }
  } 
  const mapStateToProps = state => {
    return { auth: state.auth }
  };

  return connect(mapStateToProps)(AuthHoc);
} // deci fn asta return class

export default authHoc;