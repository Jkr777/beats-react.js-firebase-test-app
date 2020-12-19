import { Component } from "react";
import { connect } from 'react-redux';
import { addReview, clearReview, getReviewById, editReview } from "../../../store/actions";
import { Form, Button, Col } from 'react-bootstrap';
import { Formik } from "formik";
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Uploader from "./uploader";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class ReviewForm extends Component {
  state = {
    initialValues: {
      title: "",
      excerpt: "",
      rating: "",
      public: ""
    },
    disable: false,
    editor: "",
    editorError: false,
    img: 'https://via.placeholder.com/400',
    imgName: '',
    imgError:  ''
  };

  componentDidMount(){
    const id = this.props.id; // daca avem id insemana ca aceasta comp e fol pt editare, daca nu, pt adaugare!

    if(id) { // daca review'ul cu acest id exista, vfacem req pt toate prop pt ca vem sa se vada in edit form. 
        this.props.dispatch(getReviewById(id)).then(()=>{
            const reviewById = this.props.reviews.reviewById;
            this.setState({
                mode:'edit',
                editor: reviewById.content,
                img: reviewById.downloadUrl,
                imgName: reviewById.img,
                initialValues:{
                    title: reviewById.title,
                    excerpt: reviewById.excerpt,
                    rating: reviewById.rating,
                    public:  reviewById.public
                }
            });
        }).catch((e)=>{ // in cazul unui id care nu exista
            this.props.history.push('/dashboard/reviews');
            toast.error('Sorry, the post does not exists',{
                position:toast.POSITION.BOTTOM_RIGHT
            })
        })
    }
  }

  componentWillUnmount(){
    this.props.dispatch(clearReview());
  } // dupa ce ies stergem datele din form review

  handleResetForm = resetForm => {
    resetForm({}); // resetm form, ast e metoda din packet
    this.setState({
      editor: "",
      img: 'https://via.placeholder.com/400',
      imgError: false,
      disable: false
    }); // resetam si textul complicat
    toast.success("Congrats you post has beed uploaded!", {
      position: toast.POSITION.TOP_CENTER
    });
  }

  handleImageName = (name, download) => {
    this.setState({ img: download, imgName: name}); // adauga url si numele dupa ce uploadam img 
  }

  handleSubmit = (values, resetForm) => {
    let formData = { ...values, content: this.state.editor, img: this.state.imgName };
    if (this.state.mode === 'add') { // verifica daca e forl de add sau edit
      this.props.dispatch(addReview(formData, this.props.auth.user)).then(() => {
        this.handleResetForm(resetForm);
      });
    } else {
      this.props.dispatch(editReview(formData, this.props.id)).then(() => {
        this.setState({ disable: false });
        toast.success('Congrats you post has been updated', {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      })
    }

  }

  render() {
    const state = this.state;
    return (
      <Formik
        enableReinitialize
        initialValues={state.initialValues}
        validationSchema={Yup.object({
          title: Yup.string().required('The title is required'),
          excerpt: Yup.string().required('Add some text'),
          rating: Yup.number().required('The rating is required'),
          public: Yup.number().required('Is it public or a draft ?')
        })}
        onSubmit={(values, {resetForm}) => {
          if(Object.entries(state.editor).length === 0) {
            return this.setState({ editorError: true });
          } else if(state.imgName === "") { // verificam daca timite form fara img
            return this.setState({ imgError: true, editorError: false });
          } else { 
            this.setState({ disable: true, editorError: false });
            this.handleSubmit(values, resetForm);
          } // verifica daca editorul e gol. Dca e trimitem o errorare
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                  { errors.title && touched.title
                      ? <div className="error">{ errors.title }</div>
                      : null
                  }
                </Form.Group>
                <Form.Group>
                  <Form.Label>Excerpt</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    name="excerpt"
                    value={values.excerpt}
                    onChange={handleChange}
                  />
                  { errors.excerpt && touched.excerpt
                      ? <div className="error">{ errors.excerpt }</div>
                      : null
                  }
                </Form.Group>
                <Form.Group>
                  <CKEditor 
                    editor={ ClassicEditor } // tre creata o instanta pt editor 
                    data={ state.editor }  // ii adaugam default data 
                    onChange={(event, editor) => {
                      this.setState({
                        editor: editor.getData() 
                      })
                    }} // onCHange e prop din editor fol ca in onChage din react. Pasam o callback in care ne pune auto 2 prop, event si editor, event pt event si editor contine dat din editor. .getData() metoda fol pt a primi data care o scriem in editor
                  />
                </Form.Group>
                { state.editorError ?                
                    <div className="error">Sorry, you need to add data here too</div>
                    : null
                }

                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    name="rating"
                    value={values.rating}
                    onChange={handleChange}
                  >
                    <option value="" defaultValue>Choose...</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </Form.Control>
                  { errors.rating && touched.rating
                      ? <div className="error">{ errors.rating }</div>
                      : null
                  }
                </Form.Group>
                <Form.Group>
                  <Form.Label>Public</Form.Label>
                  <Form.Control
                    as="select"
                    name="public"
                    value={values.public}
                    onChange={handleChange}
                  >
                    <option value="" defaultValue>Choose...</option>
                    <option value="1">Public</option>
                    <option value="0">Draft</option>
                  </Form.Control>
                  { errors.public && touched.public
                      ? <div className="error">{ errors.public }</div>
                      : null
                  }
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={state.disable}>
                  Submit
                </Button>
              </Col>
              <Col>
                <Uploader
                  handleImageName={this.handleImageName}
                  img={state.img}
                /> 
                { state.imgError ?  <div className="error">Add an image please</div> : null }
              </Col>
            </Form.Row>
          </Form>
        )}
      </Formik>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  reviews: state.reviews
})

export default connect(mapStateToProps)(ReviewForm);