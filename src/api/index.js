import firebase from 'firebase/app';
import 'firebase/auth';
import { usersCollection, reviewsCollection, serverTimestamp } from "../utils/fbase";

export const registerUser = async ({ email, password, name, lastName }) => {
  try {
    const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const { user } = response;

    const userProfile = {
      uid: user.uid,
      email,
      name,
      lastName,
      role: 1
    };
    await usersCollection.doc(user.uid).set(userProfile); // adauga userul in db
    firebase.auth().currentUser.sendEmailVerification(null); // trimite o verification email
    return { isAuth: true, user: userProfile };
  } catch(error) {
    return { error: error.message };
  } 
};

export const loginUser = ({ email, password }) => (
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(response => {
      return usersCollection.doc(response.user.uid).get().then(snapshot => ({ isAuth: true, user: snapshot.data()}));
    }).catch(error => {
      return { error: error.message };
    })
); // lol aici fol promisa

export const autoSignIn = () => (
  new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        usersCollection.doc(user.uid).get().then(snapshot => {
          resolve({ isAuth: true, user: snapshot.data() });
        });
      } else {
        resolve({ isAuth: false, user: null  });
      }
    });
  })
);

export const logOut = () => firebase.auth().signOut();

export const updateProfile = (formData, isEmailChanged) => {
  const collection = usersCollection.doc(formData.uid);
  const updateDocument = () => 
    collection.update(formData).then(() => (
      collection.get().then(snapshot => (
        { isAuth: true, user: snapshot.data() }
      ))
    ))

  if(isEmailChanged) {
    let getUser = firebase.auth().currentUser;
    getUser.updateEmail(formData.email);
    return updateDocument();
  } else {
    return updateDocument();
  }
}

// reviews 

export const addReview = (data, user) => (
  reviewsCollection.add({
    ...data,
    createdAt: serverTimestamp(),
    rating: parseInt(data.rating),
    public: parseInt(data.pubic),
    ownerData: {
      ownerId: user.uid,
      name: `${user.name} ${user.lastName}`
    }
  }).then(docRef => {
    return docRef.id
  })
);