import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import AdminSignin from "./components/AdminSigin";
import VendorSignin from "./components/VendorSignin";
import VendorSignup from "./components/VendorSignup";
import AdminHome from "./components/AdminHome";
import AdminUploadTender from "./components/AdminUploadTender";
import AdminViewTender from "./components/AdminViewTender";
import VendorUploadTender from "./components/VendorUploadTender";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/admin/signin" exact element={<AdminSignin />} />
          <Route path="/vendor/signin" exact element={<VendorSignin />} />
          <Route path="/vendor/signup" exact element={<VendorSignup />} />

          <Route path="/admin/home" exact element={<AdminHome />} />
          <Route path="/admin/uploadtender" exact element={<AdminUploadTender />} />
          <Route path="/admin/viewtender" exact element={<AdminViewTender />} />


          <Route path="/vendor/uploadtender" exact element={<VendorUploadTender />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
