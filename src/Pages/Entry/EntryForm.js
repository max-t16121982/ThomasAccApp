import React, { useEffect, useState } from 'react';
import Select from "react-select"
const EntryForm = () => {
  // const [ipaddress, setIPaddress] = useState('103.206.139.246');
  // const [port, setPort] = useState('3310');
  var [search, setSearch] = useState([])
  const [Company, setCompany] = useState([]);
  const [Account, setAcc] = useState([]);
  const [CompName, setCompanyName] = useState();
  const [AccName, setSelects] = useState();
  const [vochno, setVochNo] = useState();
  const [refno, setRefNo] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [DebitAccName, setDebitAccName] = useState('');
  const [CreditAccName, setCreditAccName] = useState('');
  const [debitrem, setDebitRem] = useState('');
  const [creditrem, setCreditRem] = useState('');
  const [menusname, setMenusName] = useState();
  const [subnmenusname, setSubMenusName] = useState();
  const [startDate, setStartDate] = useState(localStorage.getItem('database').replace('sas', '').substring(0, 4) + '-04-01');

  const Prints = () => {
    window.print()
  }

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "ipaddress": localStorage.getItem('ipaddress'),
      "port": localStorage.getItem('port'),
      "database": localStorage.getItem('database')
    }),
  };

  useEffect(() => {
    fetch('http://103.206.139.246:8081/AccountMaster', options)
      .then(res => res.json())
      .then(Account => setAcc(Account))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetch('http://103.206.139.246:8081/companymaster', options)
      .then(res => res.json())
      .then(Company => setCompany(Company))
      .catch(err => console.log(err))
  }, [])

  const handleChange = (selectedOption) => {
    setSelects(selectedOption);
    //console.log(`Option selected:`, selectedOption);
  }

  const handleCompChange = (selectedCompOption) => {
    setCompanyName(selectedCompOption);
   // console.log(`Option selected:`, selectedCompOption);
  }
  //new -- start
  const handleMenusChange = (selectedCompOption) => {
    setMenusName(selectedCompOption);
   // console.log(`Option selected:`, selectedCompOption);
  }
  const handleSubMenusChange = (selectedCompOption) => {
    setSubMenusName(selectedCompOption);
    //console.log(`Option selected:`, selectedCompOption);
  }
  const handleDebitChange = (selectedCompOption) => {
    setSubMenusName(selectedCompOption);
    //console.log(`Option selected:`, selectedCompOption);
  }
  const handleCreditChange = (selectedCompOption) => {
    setSubMenusName(selectedCompOption);
    //console.log(`Option selected:`, selectedCompOption);
  }

  const handleAmtChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
      setAmount(e.target.value)
    // }
  }

  //new -- start
  return (
    <div className="App" style={{ marginLeft: '10px', marginRight: '10px' }} >


      <h2>Entry Form</h2>
      {/* Company Name */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Company Name  : </label>
      <Select options={Company.length == undefined && Company.length == 0 ? null : Company.map((i) => ({ value: i.TrnasID, label: i.CoName }))}
        onChange={handleCompChange}
        value={CompName}
      ></Select>

      {/* Menus */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Menus  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleMenusChange}
        value={menusname}
      ></Select>

      {/* Sub Menus */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Sub Menus  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleSubMenusChange}
        value={subnmenusname}
      ></Select>

      {/* Account Name */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Account Name  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleChange}
        value={AccName}
      ></Select>

      {/* Voucher No. */}

      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Vch.No.: </label>
        <input type="text" style={{ width: "50px" }} placeholder="" value={vochno} name="vouchno" onChange={(e) => setVochNo(e.target.value)} required />

        <span>  </span>

      {/* Dates */}
        <label style={{fontWeight: 'bold' }} htmlFor="datepicker">   Date : </label>
        <input
          type="date"
          id="datepicker"
          value={startDate}
          style={{ width: "120px"}}
          onChange={e => setStartDate(e.target.value)}
        />
      </div>
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
      {/* Ref.No. */}
      <label style={{ fontWeight: 'bold' }}>Ref.No.: </label>
        <input type="text" style={{ width: "50px" }} placeholder="" value={refno} name="refno" onChange={(e) => setRefNo(e.target.value)} required />
        <span>  </span>
      {/* Amount */}
      <label style={{fontWeight: 'bold' }}>Amt. : </label>
        {/* <input type="text" style={{ textAlign: 'right', width: "120px" }} placeholder="" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)} required /> */}
        <input type="number" style={{ textAlign: 'right', width: "120px" }} 
        placeholder="" value={amount} name="amount" 
        onChange={handleAmtChange} required />
      </div>

      <span>  </span>

      {/* Debit Account */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Debit Account  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null :
        Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleDebitChange}
        value={DebitAccName}
      ></Select>

      {/* Credit Account */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Credit Name  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleCreditChange}
        value={CreditAccName}
      ></Select>
      <span>  </span>
      {/* Debit Remark */}
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Debit Remark.: </label>
        <input style={{ width: "100%" }} type="text" placeholder="Enter Debit Remark" 
          value={debitrem} name="debitrem"
          onChange={(e) => setDebitRem(e.target.value)} required />
      </div>

      {/* Credit Remark */}
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Credit Remark.: </label>
        <input type="text" placeholder="Enter Credit Remark" 
          style={{ width: "100%" }} value={creditrem} name="creditrem"
          onChange={(e) => setCreditRem(e.target.value)} required />
      </div>


      <button style={{ border: '2px solid ', height: '35px', width: '60px' }} title="Print Record" onClick={Prints} >
        Print
      </button>

    </div>
  );
};

export default EntryForm;