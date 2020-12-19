import firebase from 'firebase/app';
import 'firebase/auth';
import { usersCollection, reviewsCollection, serverTimestamp, messagesCollection } from "../utils/fbase";

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
    public: parseInt(data.public),
    ownerData: {
      ownerId: user.uid,
      name: `${user.name} ${user.lastName}`
    }
  }).then(docRef => {
    return docRef.id
  })
);

export const getReviews = (limit) => (
  reviewsCollection
  .orderBy('createdAt') // le ordonam pe baza creatiei
  .limit(limit)
  .get()
  .then( snapshot =>{
      const lastVisible = snapshot.docs[snapshot.docs.length-1]; // vrea sa selecteze ultimul post adaugat, pe baza createdAt. Pt ca vrea sa apara ultimul in template... lol 
      const reviews = snapshot.docs.map( doc => ({
          id: doc.id, ...doc.data()
      })); // loop asta se face pe cele 2 docs, nu pe toate colectia lol

      return { posts: reviews,lastVisible:lastVisible }
  })
);

export const loadMoreReviews = (limit, reviews) => {
  let posts = [...reviews.posts];
  let lastVisible = reviews.lastVisible; // in prop asta din redux e o referinta firebase stocata. Ne tre pt load more logic.

  if(lastVisible){
      return reviewsCollection
      .orderBy('createdAt')
      .startAfter(lastVisible) // aham pt asta ii tre, vrea sa inceapa aducerea dupa ultimul rev pe care ul avem. Nu mai facem req si pt cele de sus
      .limit(limit)
      .get()
      .then( snapshot => {
          const lastVisible = snapshot.docs[snapshot.docs.length-1]; // meh aduce doar 1, schimba ultimul vizibil iarasi
          const newReviews = snapshot.docs.map( doc => ({
              id: doc.id, ...doc.data()
          }));

          return { posts: [...posts, ...newReviews],lastVisible }
      });
  } else {
      console.log('no more posts')
      return { posts, lastVisible }
  }
}

export const editReview = (data, id) => (
  reviewsCollection.doc(id).update(data).then(()=>{ // deci e bine sa avem id'ul salvat, de ex aici fol id'ul collectiei, salvat in user pt a face un singur req, asa faceam 2.
      return getReviewById(id) 
  })
) // fol pt a edita un review

export const getReviewById = async(id) => {
  try {
      const snapshot = await reviewsCollection.doc(id).get(); // accesam collectia s
      const data = snapshot.data();

      const url = await firebase.storage().ref(`reviews/${data.img}`).getDownloadURL(); // iau si img pt review
      return { ...data, downloadUrl:url }
  } catch(error) {
      return null
  }
} // facem req pt un review

// posts
export const fetchPosts = (limit=3, where=null) => { // posts la asta sunt reviews
  return new Promise((resolve, reject)=>{
     let query = reviewsCollection.where('public','==',1); // adauga regula default, vrem posts cu propietatea public sa aibe val 1. // tre creat un idex pt propietatea 'public' in firebase pt a putea fol prop asta, video 78
      
     if(where){ // daca nu am reguli where, selectam fol createdAt
          query = query.where(where[0], where[1],where[2]); 
     } else {
          query = query.orderBy('createdAt'); 
     }

     query.limit(limit).get().then( snapshot => {  //tre limitata
         const post = snapshot.docs.map( doc => ({
             id: doc.id, ...doc.data()
         }));
         resolve(post)
     })
  });
}

// contact

export const sendContact = (data) =>{
  return messagesCollection.add({
      ...data,
      createdAt:serverTimestamp()
  }).then( docRef => {
      return docRef.id
  }) 
} // adauga un mess nou in colectia messages, asta fol functions ca sa trimita mess in mail..