import React, { useEffect, useState } from 'react';
import Select from "react-select"
// import cookie from "react-cookie"
const LoginForm = ({ onLogin }) => {
  // const [ipaddress, setIPaddress] = useState('103.206.139.246');
  // const [port, setPort] = useState('3310');
  const [ipaddress, setIPaddress] = useState();
  const [port, setPort] = useState();
  const [Database, setDatabase] = useState();
  const [DBName, setDBName] = useState();
  const [IsDisLogin, setIsDisLogin] = useState(true);
  const [IsDisConn, setIsDisConn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // if ((getCookie("ipaddress") != undefined && getCookie("ipaddress") != "") &&
  //   getCookie("port") != undefined && getCookie("port") != "") {
  //     setIPaddress(getCookie("ipaddress"))
  //     setPort(getCookie("port"))
  // }

  useEffect(() => {
    if (localStorage.getItem("ipaddress") != null && localStorage.getItem("ipaddress") != 'null') {
      setIPaddress(localStorage.getItem("ipaddress"))
      setPort(localStorage.getItem("port"))
    }
  }, [])

  const handleDBChange = async (selectedDBOption) => {
    setDBName(selectedDBOption);
    localStorage.setItem("database", selectedDBOption.value)
    const options_comp = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "ipaddress": ipaddress, "port": port, "database": selectedDBOption.value }),
    };
    const resp_comp = await fetch('http://103.206.139.246:8081/companymaster', options_comp)
      .then(res => res.json())
      .catch(err => console.log(err))
    if (resp_comp.length > 0) {
      localStorage.setItem("companymst", JSON.stringify(resp_comp))
      setIsDisLogin(false)
    }

    // const options_acc = {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ "ipaddress": ipaddress, "port": port, "database": selectedDBOption.value }),
    // };
    // const resp_acc = await fetch('http://103.206.139.246:8081/AccountMaster', options_acc)
    //   .then(res => res.json())
    //   .catch(err => console.log(err))
    // if (resp_acc.length > 0) {
    //   localStorage.setItem("accmst", JSON.stringify(resp_comp))
    // }



    // console.log(`Option selected:`, selectedDBOption.value);
  }
  //const CreateDBEx = async() => {
  function CreateDBEx() {
    try {
      fetch('https://sheetdb.io/api/v1/lyluil79lj4j3', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [
            {
              'IP_Adrress': ipaddress,
              'Port': port,
              'Date': (new Date()).toDateString(),
              'Created_Date': (new Date()).toDateString(),
              'Trail': 'Yes',
              'Days': 31
            }
          ]
        })
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
    catch (e) {
      console.log(e)
      return false
    }
    return true
  }

  const handleConnect = () => {
    (async () => {
      setIsDisConn(true)
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "ipaddress": ipaddress, "port": port }),
      };
      //'http://103.206.139.246:8081/connect'
      const response = await fetch('http://103.206.139.246:8081/connect', options)
        .then(res => res.json())
        //.then(Database => setDatabase(Database))
        .catch(err => console.log(err))

      if (response.length > 0) {
        // cookie.set("ipaddress", ipaddress, 30);
        // cookie.set("port", port, 30);
        const blnVldDB = true
        const db = await fetch('https://sheetdb.io/api/v1/lyluil79lj4j3/search?IP_Adrress=' + ipaddress + '&Port=' + port)
          .then((response) => response.json())
          .catch(err => console.log(err))
        if (db.length > 0) {
          if (db[0].Days <= 0) {
            alert("Contact SAS Team, give a missed call on 7984920200, they will contact you back.")
            window.location.href = '/'
            blnVldDB = false
          } else {
            if (db[0].Trail == 'Yes') {
              localStorage.setItem("comp_duedays", db[0].Days)
          } else {
            localStorage.setItem("comp_duedays", '') 
          }
        }
        } else {
          if (CreateDBEx() == false) {
            localStorage.setItem("comp_duedays", '31')
            alert("Contact SAS Team, give a missed call on 7984920200, they will contact you back.")
            window.location.href = '/'
            blnVldDB = false
          }
        }
        //

        if (blnVldDB == true) {
          setDatabase(response)
          //setIsDisLogin(false)
          localStorage.setItem("ipaddress", ipaddress)
          localStorage.setItem("port", port)
          localStorage.setItem("companymst", null)
          handleDBChange({ value: response[0].DATABASENME, label: response[0].COAYEAR });
          console.log(response)
          setIsVisible(true)
        }
        setIsDisConn(false)
      } else {
        setIsDisConn(false)
        alert('Invalid credentials');
      }
      setIsDisConn(false)
    })();

  }

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you can implement your login logic
    // For simplicity, just calling onLogin with hardcoded credentials
    // (async () => {
    //   const options = {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ "ipaddress": ipaddress, "port": port }),
    //   };
    //   const response = await fetch('http://103.206.139.246:8081/connect', options)
    //   if (response.status == '200') {
    //     localStorage.setItem("ipaddress", ipaddress)
    //     localStorage.setItem("port", port)
    //     ///onLogin(ipaddress);
    // let blnDB = false
    // if (DBName != undefined) {
    //   if (DBName != "") {
    //     blnDB = true
    //     onLogin(ipaddress);
    //   }
    // }
    // if (blnDB == false) {
    //   alert("Database name not selected....")
    // }
    // //   } else {
    //     alert('Invalid credentials');
    //   }
    // })();
  };

  const IsLogin = () => {
    let blnDB = false
    if (DBName != undefined) {
      if (DBName != "") {
        blnDB = true
        onLogin(ipaddress);
      }
    }
    if (blnDB == false) {
      alert("Database name not selected....")
    }

  }


  return (
    <div class="centered" style={{ backgroundColor: 'grey' }}>
      <form onSubmit={handleLogin}>
        <table style={{ border: '2px solid black', marginLeft: '20px', marginRight: '20px', marginTop: '20px', backgroundColor: 'white' }}>
          <div style={{ marginLeft: '20px', marginRight: '20px' }}>
            <h2 >Login</h2>
          </div>
          <div style={{ marginLeft: '20px', marginRight: '20px' }}>
            <label style={{ color: 'green', fontWeight: 'bold' }}>IP Adress: </label>
            <input type="text" placeholder="Enter IP Address" value={ipaddress} name="ipaddress" onChange={(e) => setIPaddress(e.target.value)} required />
          </div>
          <div style={{ marginLeft: '20px', marginRight: '20px' }}>
            <label style={{ color: 'green', fontWeight: 'bold' }}>Port.........: </label>
            {/* <input type="text" placeholder="Enter Username" name="uname" required/> */}

            <input type="text" placeholder="Enter port" value={port} name="port" onChange={(e) => setPort(e.target.value)} required />
          </div >
          <span>    </span>
          <button style={{ color: 'white', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', backgroundColor: '#0056b3' }}
            onClick={handleConnect}>
            Connect</button>
             <a href={'https://drive.google.com/file/d/1fK3Vc21x1qux8aHqD8DrZia5VWgox0tR/view?usp=sharing'}>Demo</a>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             <a href={'https://docs.google.com/document/d/1ZeirzbhnATy8nhyox40HOlsqekiTWKes9e6S3keTcp4/edit?usp=sharing'}>     Document</a> 
          <div>
            {isVisible ? <label style={{ fontWeight: 'bold' }} htmlFor="">Database  : </label> : null}
            {/* options={Database == undefined && Database.length == 0 ? null : Database.map((i) => ({ value: i.DATABASENME, label: i.COAYEAR }))} */}
            {isVisible ?
              <Select options={Database == undefined ? null : Database.map((i) => ({ value: i.DATABASENME, label: i.COAYEAR }))}
                onChange={handleDBChange}
                value={DBName}
              //defaultValue='2023-2024'
              ></Select> : null}
          </div>
          {isVisible ?
            <button
              style={{ color: 'white', fontWeight: 'bold', marginLeft: '20px', marginRight: '20px', backgroundColor: '#0056b3' }}
              onClick={IsLogin}
              disabled={IsDisLogin}
              type="submit">Login</button> : null}
        </table >
      </form>
    </div>

  );
};

export default LoginForm;