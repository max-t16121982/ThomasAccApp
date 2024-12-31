import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Switch, Route
} from 'react-router-dom';
import Ledger from "./Pages/Report/Ledger";
import BillOutstanding from "./Pages/Report/BillOutstanding";
import MillOutstanding from "./Pages/Report/MillOutstanding";
import SalesLRPending from "./Pages/Report/SalesLRPending";
import AG_Ledger from "./Pages/Report/Ag_Ledger";
import Navbar from './Components/Navbar';
import LoginForm from './Pages/Login/LoginForm';
//import EntryForm from './Pages/Entry/EntryForm';
import SalesOrderForm from './Pages/Entry/SalesOrder';
import text_1 from './Pages/text_1';
var bln = false
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(bln);
  const handleLogin = () => {
    bln = true
    setIsLoggedIn(true);
  };

  


  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          {/* <Router> */}
          <Navbar />
          <text_1 />
          <main>
            <Switch>
              {/* <Route path="/" element={<Ledger />} /> */}
              <Route path="/" exact>
              
                <Ledger />
              </Route>
              <Route path="/BillOutstanding" >
                <BillOutstanding />
              </Route>
              <Route path="/SalesLRPending" >
                <SalesLRPending />
              </Route>
              <Route path="/MillOutstanding"  >
                <MillOutstanding />
              </Route>
              <Route path="/AG_Ledger"  >
                <AG_Ledger />
              </Route>
              {/* <Route path="/EntryForm"  >
                <EntryForm />
              </Route> */}
               <Route path="/SalesOrderForm"  >
                <SalesOrderForm />
              </Route> 
              {/* <Route>
                <></>
              </Route> */}

              {/* </Routes> */}
              {/* <Redirect to="/" /> */}
            </Switch>
          </main>
          {/* </Router> */}

        </>) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );

}

export default App;
