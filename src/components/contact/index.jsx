import { useForm } from 'react-hook-form';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import { sendContact } from '../../store/actions';

const Contact = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, reset } = useForm();

  const submitForm = data => {
    dispatch(sendContact(data)).then(()=>{ 
      toast.success('Thanks, we will contact you back as soon as possible.',{
        position:toast.POSITION.BOTTOM_RIGHT
      });
      reset();  
    })
  }


  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit(submitForm)} className="form_contact">
          <h1>Contact us</h1>
          <hr />
          <Form.Group>
            <Form.Label>Add your name here</Form.Label>
            <Form.Control
              type="text"
              name="name"
              ref={register({required:true})}
            />
            {errors.name &&  <span className="error">This field is required</span>}
           
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="Email"
              name="email"
              ref={register({
                required:true,
                pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
              })}
            />
            {errors.email &&  <span className="error">Please check your email</span>}
          </Form.Group>
          <Form.Group>
            <Form.Label>Example textarea</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              name="message"
              ref={register({required:true})}
            />
            {errors.message &&  <span className="error">Add a message</span>}
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

      </Container>
    </>
  )
}

export default Contact;
;