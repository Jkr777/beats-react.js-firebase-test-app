import React, { Component } from "react";
import { registerUser, loginUser } from "../../store/actions";
import { toast } from 'react-toastify';
import Prevent from "../hoc/prevent";

class Login extends Component {
  state = {
    formData: {
      name: "",
      lastName: "",
      password: "",
      email: ""
    },
    register: false,
    loading: false
  };

  handleInput = e => {
    this.setState(prev => ({
      formData: {
        ...prev.formData,
        [e.target.name]: e.target.value
      }
    }))
  };

  handleFormType = () => {
    this.setState(prev => ({
      register: !prev.register
    }))
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    if(this.state.register) {
      this.props.dispatch(registerUser(this.state.formData)).then(({ payload }) => {
        this.handleRedirection(payload);
      });
    } else {
      this.props.dispatch(loginUser(this.state.formData)).then(({ payload }) => {
        this.handleRedirection(payload);
      });
    }
  };

  handleRedirection = result => {
    if(result.error) {
      this.setState({ loading: false });
      toast.error(result.error, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      return this.props.history.push("/dashboard");
    }
  };

  render() {
    const { register, formData, loading } = this.state;
    let formTitle = register ? "Register" : "Sign in";
    return (
      <div className="container login-wrapper">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h1 className="h3 mb-3 font-weight-normal">
            {formTitle}
          </h1>

          {
            register ?
            <>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control mb-3"
                placeholder="Your name"
                autoComplete="off"
                value={formData.name}
                onChange={this.handleInput}
              />

              <input
                type="text"
                id="lastname"
                name="lastName"
                className="form-control mb-3"
                placeholder="Your lastname"
                autoComplete="off"
                value={formData.lastName}
                onChange={this.handleInput}
              />
          </>
          : null
          }

          <input
            type="email"
            id="email"
            name="email"
            className="form-control mb-3"
            placeholder="Email address"
            autoComplete="email"
            value={formData.email}
            onChange={this.handleInput}
          />

          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Password"
            autoComplete="off"
            value={formData.password}
            onChange={this.handleInput}
          />

          <br />
          <button className="btn btn-lg btn-primary btn-block" type="submit" disabled={loading}>
            Register or Login
          </button>

          <div className="mt-3">
            {register ? 'Need to sign in':'Not registered' } ? click <span onClick={() => this.handleFormType()} className="login_type_btn"> here </span> to { register ?  "Sign in" : "Register"}
          </div>
      </form>
    </div>
    );
  }
}


export default Prevent(Login);