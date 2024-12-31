import React from "react";
import "./Navbar.css";
import { NavLink, Link } from "react-router-dom";
const Navbar = (isLoggedIn) => {
    // const handlelogout = () => {
    //     window.href = "http://localhost:3000" 
    // }
    function logout() {
        localStorage.clear();
        window.location.href = '/';
    }
    return (

        <nav className="navbar navbar-expand-lg navbar-mainbg">
            <NavLink className="navbar-brand navbar-logo" to="/" exact>
                Thomas Solutions   <h5>IP:{localStorage.getItem('ipaddress')},<br></br>
                    PORT:{localStorage.getItem('port')},<br></br>
                    DB: {localStorage.getItem('database')}
                    {localStorage.getItem('comp_duedays') != null && localStorage.getItem('comp_duedays') != '' ? ',Trail:' + localStorage.getItem('comp_duedays') : null}
                </h5>
            </NavLink>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            ><i className="fas fa-bars text-white"></i>

            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml=auto">
                    <div className="hori-selector">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                    <li className="nav-item active">
                        <NavLink className="nav-link" style={{ backgroundColor: '#00008' }} to="/"
                            exact>
                            <i className="fas fa-address-book"></i>
                            Ledger
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/BillOutstanding"
                            exact>
                            <i className="fas fa-balance-scale-left"></i>
                            Party Outstanding
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/SalesLRPending"
                            exact>
                            <i className="fas fa-balance-scale-left"></i>
                            LR Pending
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to="/MillOutstanding" exact>
                            <i className="fas fa-balance-scale-right"></i>
                            Mill Outstanding
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to='/AG_Ledger' exact>
                            <i className="fas fa-address-book"></i>
                            Agency Ledger
                        </NavLink>
                    </li>
                    {/* <li className="nav-item active">
                        <NavLink className="nav-link" to='/EntryForm' exact>
                            <i className="fas fa-address-book"></i>
                            Entry Form
                        </NavLink>
                    </li> */}
                    <li className="nav-item active">
                        <NavLink className="nav-link" to='/SalesOrderForm' exact>
                            <i className="fas fa-address-book"></i>
                            Sales Orders Form
                        </NavLink>
                    </li>
                    <li className="nav-item active">
                        <NavLink className="nav-link" to='/logout' onClick={logout} exact>
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default Navbar;