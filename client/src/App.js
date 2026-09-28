import React from "react";

import { BrowserRouter,  Route,  Routes } from "react-router-dom"
import Home from "./Home";
import Signup from "./pages/signUp";
import Login from "./pages/Login";
import Products from "./pages/Products";

  
    

function App (){
        return(
            
            <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
        )
        
    
    
}
export default App