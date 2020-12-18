import { useState } from "react";
import DashLayout from "../../../utils/dash_layout";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form"; // merge doar cu fn components
import LoginModal from "../../../utils/login_modal";
import { updateProfile } from "../../../store/actions";
import { toast } from 'react-toastify';

function Profile(props) {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm(); // avem mai multe uita te in documentatie. Nu mai tre sa fol handleChange
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState({
    open: false,
    formData: ''
  });

  const handleReAuthModal = data => {
    setShowModal({ open: true, formData: data });
  }

  const submitForm = data => {
    const isEmailChanged = auth.user.email === data.email ? false : true;
    setDisabled(true);
    setShowModal({ open: false, formData: "" });

    // dispatch
    dispatch(updateProfile({ uid: auth.user.uid, ...data }, isEmailChanged)).then(() => {
      toast.success('Congrats your profile has been updated', {
        position: toast.POSITION.TOP_CENTER
      });
    });
  } // handleSubmit() verifica daca form e corect si invoca fn asta, care e pasata in ea. data contine toate val inputurilor. Tre adaugata ref pe fiecare input, vezi in form. In fiecare ref pasam register, o fn creata sus. In fn register pasam un obj in care specificam rules pt fiecare input. Uita-te in documentatie pt mai mute rules.

  const handleClose = () => setShowModal({ open: false, formData: '' });

  return (
    <DashLayout
      auth={auth}
      title="Profile"
    >
      <form onSubmit={handleSubmit(handleReAuthModal)}> 
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name">First name</label>
            <input type="text"
              className="form-control"
              name="name"
              defaultValue={auth.user.name}
              ref={register({required: true})}
            />
            { errors.name && <span className="error">This field is required</span> }
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="lastname">Last name</label>
            <input type="text"
              className="form-control"
              name="lastName"
              defaultValue={auth.user.lastName}
              ref={register({required: true})}
            />
            { errors.lastName && <span className="error">This field is required</span> }
          </div>
        </div>


        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input type="email"
            className="form-control"
            name="email"
            defaultValue={auth.user.email}
            ref={register({
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
            })}
          />
          { errors.email && <span className="error">Please check your email</span> }
        </div>


        <div className="mb-3">
          <label htmlFor="address">Address</label>
          <input type="text"
            className="form-control"
            name="address"
            defaultValue={auth.user.address}
            ref={register}
          />

        </div>


        <div className="row">
          <div className="col-md-5 mb-3">
            <label htmlFor="gen">What are you ?</label>
            <select className="custom-select d-block w-100"
              name="gen"
              defaultValue={auth.user.gen}
              ref={register}
            >
              <option value="" defaultValue>Choose...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="musician">Musician</option>
              <option value="robot">Robot</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="daw">DAW</label>
            <select className="custom-select d-block w-100"
              name="daw" 
              defaultValue={auth.user.daw}
              ref={register}
            >
              <option value="" defaultValue>Choose...</option>
              <option value="ableton">Ableton</option>
              <option value="bitwig">Bitwig</option>
              <option value="studio one">Studio one</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label htmlFor="age">Age</label>
            <input type="text"
              className="form-control"
              name="age"
              defaultValue={auth.user.age}
              ref={register}
            />
          </div>
        </div>

        <hr className="mb-4" />

        <button
          className="btn btn-outline-primary btn-lg btn-block"
          type="submit"
          disabled={disabled}
        >Update profile</button>
      </form>
      <LoginModal 
        modalState={showModal}
        handleClose={handleClose}
        submitForm={data => submitForm(data)}
      />
      </DashLayout>
  )
}

export default Profile;