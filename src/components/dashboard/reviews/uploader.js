import { useState } from "react";
import firebase from 'firebase/app'; // ii e lene sa faca ast afol redux, o face direct
import 'firebase/storage';
import { Form, ProgressBar } from 'react-bootstrap';

const Uploader = props => {
  const [progress, setProgess] = useState(0);

  const handleChange = event => {
    if(event.target.files[0]) {
      const image = event.target.files[0];
      const time = new Date().getTime(); // vrea sa fo time in numele img
      const storage = firebase.storage();
      const uploadTask = storage.ref(`reviews/${time}-${image.name}`).put(image); // adauga img in folderul reviews
      uploadTask.on('state_changed',
        (snapShot) => {
          const progress = Math.round((snapShot.bytesTransferred / snapShot.totalBytes) * 100);
          setProgess(progress);
        },
        (error) => {console.log(error)},
        () => {
          setProgess(0);
          uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
            console.log("file available at", downloadUrl);
            props.handleImageName(uploadTask.snapshot.ref.name, downloadUrl); // pasam numele referintei si url'ul fol pt download
          }) // dam dupa download url pt ca vrem sa o pasam in data formularului
        } // asta e invocat cand se termina upload'ul
      
      ) // adaugam bara de progress
    }
  }

  return (
    <>
      <Form.Group>
        <img width="100%" src={props.img} alt="info about the pic"/>
        {
          progress === 0 ? <Form.File 
              id="custom-file" 
              label="Upload an image" 
              onChange={handleChange}
              custom
            />
          : <ProgressBar animated now={progress} />
        }
      </Form.Group>
    </>
  )
}

export default Uploader;