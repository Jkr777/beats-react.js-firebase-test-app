import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form"; // merge doar cu fn components
import firebase from 'firebase/app';

const LoginModal = props => {
  const [error, setError] = useState('');
  const { register, handleSubmit, errors } = useForm();

  const handleReAuth = ({ email, password }) => {
    let getUser = firebase.auth().currentUser;
    let credentials = firebase.auth.EmailAuthProvider.credential(email, password);
    if(getUser) {
      getUser.reauthenticateWithCredential(credentials).then(user => {
        props.submitForm(props.modalState.formData);
      }).catch(error => {
        console.log(error);
        setError('Sorry, try again');
      })
    }
  }

  return (
    <Modal show={props.modalState.open} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reauthentication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Sorry, we need to make sure you are you
        </p>
        <form onSubmit={handleSubmit(handleReAuth)}>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            placeholder="Email"
            ref={register({
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
            })}
          />
          { errors.email && <span className="error">Please check your email</span> }
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            ref={register({
              required: true
            })}
          />
          { errors.password && <span className="error">Check your password</span> }
          <span className="error">{error}</span>
          <button className="btn btn-primary btn-lg btn-block" type="submit">Reauth</button>
        </form>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>
  )
}

export default LoginModal;