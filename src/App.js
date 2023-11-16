import { useContext, useEffect } from "react";
import "./App.css";
import { UserContext } from "./pages/context/UserContext";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login1/Login";
import Home from "./pages/Home/Home";
import SignUp from "./pages/signup1/SignUp";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";

import Question from "./pages/question/Question";
import Answer from "./pages/Answer/Answer";
// import QuestionsList from "./context/pages/question/QuestionList";
function App() {
  const [userData, setUserData] = useContext(UserContext);

  const checkLoggedIn = async () => {
    //check if token already exists in localStorage
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      //token not in localStorage then set auth token empty
      localStorage.setItem("auth-token", "");
      token = "";
    } else {
      //if token exists in localStorage then use auth to verify token and get user info
      const userRes = await axios.get("http://localhost:4000/api/users", {
        headers: { "x-auth-token": token },
      });

      //set the global state with user info
      setUserData({
        token,
        user: {
          id: userRes.data.data.user_id,
          display_name: userRes.data.data.user_name,
        },
      });
    }
  };

  const logout = () => {
    //set global state to undefined will logout the user
    setUserData({
      token: undefined,
      user: undefined,
    });

    //resetting localStorage
    localStorage.setItem("auth-token", "");
  };

  useEffect(() => {
    //check if the user is logged in
    checkLoggedIn();
  }, []);
  return (
    <Router>
      <Header logout={logout} />
      {/* <LandingPage /> */}
      <div>
        <Routes>
          {/* Original */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* passing logout function as props to Home page */}
          <Route path="/" element={<Home logout={logout} />} />
          <Route path="/question" element={<Question />} />
          {/* Newly added routes */}
          <Route path={`/Answers/:questionId`} element={<Answer />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}
export default App;
