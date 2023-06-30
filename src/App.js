import {Navigate, Route, Routes} from "react-router-dom";
import BooksList from "./Components/BooksList";
import Registration from "./Components/Registration";
import Login from "./Components/Login";

function App() {
    const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

    return (
      <div>
        <main>
          <Routes>
            <Route path="/" exact element={<Navigate to={isLoggedIn ? "/books" : "/login"} />}/>
            <Route path="/books" element={<BooksList/>}/>
            <Route path="/registration" element={<Registration/>}/>
            <Route path="/login" element={<Login/>}/>
          </Routes>
        </main>
      </div>
  )
}

export default App;