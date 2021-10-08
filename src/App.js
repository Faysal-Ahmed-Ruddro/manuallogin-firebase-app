import "./App.css";
import initializeAuthentication from "./firbase/firebase.init";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";

initializeAuthentication();
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
function App() {
  const [name,setName] = useState("")
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const handleGoogleBtn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
const userName = (e) => {
    setName(e.target.value)
};
  const handleEmailField = (e) => {
    setUserEmail(e.target.value);
  };
  const handlePasswordField = (e) => {
    setUserPassword(e.target.value);
  };
  const toggleIn = (e) => {
    setIsLogin(e.target.checked);
  };
  
  const handleSubmitBtn = (e) => {
    e.preventDefault();
    if (userPassword.length < 6) {
      setError("Password should be at least 6 charecters");
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9_])/.test(
        userPassword
      )
    ) {
      setError(
        "Password should be at least  1 uppercase,1 lowercase,1 number,1 symbol"
      );
      return;
    }
    console.log(`Email: ${userEmail}, Password:${userPassword}`);
    isLogin
      ? processLogin(userEmail, userPassword)
      : createNewUser(userEmail, userPassword);
  };
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
        emailVerification();
        setUserName();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser).then((result) => {
      console.log(result);
    });
  };
  const hanldeResetPassword = () => {
    sendPasswordResetEmail(auth, userEmail).then((result) => {
      // Password reset email sent!
      // ..
    });
  };
  const setUserName = () =>{
      updateProfile(auth.currentUser, {displayName: name})
      .then((result) => {
        
      });
  }
  return (
    <div className="mx-5 my-4">
      <form onSubmit={handleSubmitBtn}>
        <h3 className="text-primary">
          Please {isLogin ? "Login" : "Register"}
        </h3>
        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Name
          </label>
          <div className="col-sm-10">
            <input
              onBlur={userName}
              type="text"
              className="form-control"
              required
            />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
            Email
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handleEmailField}
              type="email"
              className="form-control"
              id="inputEmail3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
            Password
          </label>
          <div className="col-sm-10">
            <input
              onBlur={handlePasswordField}
              type="password"
              className="form-control"
              id="inputPassword3"
              required
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input
                onChange={toggleIn}
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label className="form-check-label" htmlFor="gridCheck1">
                {" "}
                Already Regestered?
              </label>
            </div>
          </div>
        </div>
        <div className="text-danger row mb-3">{error}</div>
        <button type="submit" className="btn btn-primary">
          {isLogin ? "Login" : "Regester"}
        </button>
        <button
          onClick={hanldeResetPassword}
          type="submit"
          className="btn btn-primary mx-4"
        >
          Reset Password
        </button>
      </form>
      <div> ------------------------------- </div>
      <br />
      <br />
      <br />
      <button onClick={handleGoogleBtn} className="btn btn-outline-success">
        Google Btn
      </button>
    </div>
  );
}

export default App;

