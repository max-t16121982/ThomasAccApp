import React, { useEffect, useState } from 'react';
import Select from "react-select"
const SalesOrderForm = () => {
  const [Company, setCompany] = useState([]);
  const [Account, setAcc] = useState([]);
  const [ItemMst, setItemMst] = useState([]);
  const [ItemName, setItemName] = useState([]);
  const [CompName, setCompanyName] = useState();
  const [AccName, setSelects] = useState();
  const [vochno, setVochNo] = useState();
  const [refno, setRefNo] = useState('');
  const [design_no, setDesignNo] = useState('');
  const [cut, setCut] = useState('0.00');
  const [qty, setQty] = useState('0.00');
  const [rate, setRate] = useState('0.00');
  const [amount, setAmount] = useState('0.00');
  const [debitrem, setDebitRem] = useState('');
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
    fetch('https://thomasaccapp.onrender.com/AccountMaster', options)
      .then(res => res.json())
      .then(Account => setAcc(Account))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetch('https://thomasaccapp.onrender.com/companymaster', options)
      .then(res => res.json())
      .then(Company => setCompany(Company))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetch('https://thomasaccapp.onrender.com/ItemMaster', options)
      .then(res => res.json())
      .then(ItemMst => setItemMst(ItemMst))
      .catch(err => console.log(err))
  }, [])


  const handleChange = (selectedOption) => {
    setSelects(selectedOption);
    console.log(`Option selected:`, selectedOption);
  }

  const handleCompChange = (selectedCompOption) => {
    setCompanyName(selectedCompOption);
    console.log(`Option selected:`, selectedCompOption);
  }

  const handleCutChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    setCut(e.target.value)
    // }
  }

  const handleQtyChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    setQty(e.target.value)
    // }
  }

  const handleRateChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    setRate(e.target.value)
    // }
  }

  const handleAmtChange = (e) => {
    // const re = /^[0-9\b]+$/;
    // if (e.target.value === '' || re.test(e.target.value)) {
    setAmount(e.target.value)
    // }
  }

  const handleItemNameChange = (selectedOption) => {
    setItemName(selectedOption);
  }
  const handleSaleOrderSave = () => {
    alert("Sucessfully SavedeR")
  }
  const columnTemplate = [
    {
      {
        key: "costCenter",
        name: "",
        width: -1,
        hidden: true
      }
  }
  ];
  //new -- start
  return (
    <div className="App" style={{ marginLeft: '10px', marginRight: '10px' }} >
      <h2>Sales Order Form</h2>
      {/* Company Name */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Company Name  : </label>
      <Select options={Company.length == undefined && Company.length == 0 ? null : Company.map((i) => ({ value: i.TrnasID, label: i.CoName }))}
        onChange={handleCompChange}
        value={CompName}
      ></Select>
      <b>  </b>
      {/* Voucher No. */}
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        <span>  </span>

        <label style={{ fontWeight: 'bold' }}>Vch.No.: </label>
        <input type="text" style={{ width: "50px" }} placeholder="" value={vochno} name="vouchno" onChange={(e) => setVochNo(e.target.value)} required />
        <span>  </span>

        {/* Dates */}
        <label style={{ fontWeight: 'bold' }} htmlFor="datepicker">   Date : </label>
        <input
          type="date"
          id="datepicker"
          value={startDate}
          style={{ width: "120px" }}
          onChange={e => setStartDate(e.target.value)}
        />

        {/* Ref.No. */}
        <label style={{ fontWeight: 'bold' }}>Ref.No.: </label>
        <input type="text" style={{ width: "50px" }} placeholder="" value={refno} name="refno" onChange={(e) => setRefNo(e.target.value)} required />
        <span>  </span>
      </div>

      {/* Account Name */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Account Name  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleChange}
        value={AccName}
      ></Select>

      {/* Item Name */}
      <label style={{ fontWeight: 'bold' }} htmlFor="">Item Name  : </label>
      <Select options={ItemMst.length == undefined && ItemMst.length == 0 ? null : ItemMst.map((i) => ({ value: i.TrnasID, label: i.ITEMNAME }))}
        onChange={handleItemNameChange}
        value={ItemName}
      ></Select>

      <div style={{ marginLeft: '1px', marginRight: '20px' }}>

        {/* DesginNo */}
        <label style={{ fontWeight: 'bold' }}>Desgin No. : </label>
        <input type="text" style={{ textAlign: 'left', width: "220px" }}
          placeholder="" value={design_no} name="DesginNo"
          onChange={(e) => setDesignNo(e.target.value)}
          required />
      </div>
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        {/* Cut */}
        <label style={{ fontWeight: 'bold' }}>Cut : </label>
        {/* <input type="text" style={{ textAlign: 'right', width: "120px" }} placeholder="" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)} required /> */}
        <input type="number" style={{ textAlign: 'right', width: "120px" }}
          placeholder="" value={cut} name="cut"
          onChange={handleCutChange}
          required />

        {/* Qty */}
        <label style={{ fontWeight: 'bold' }}>Qty : </label>
        {/* <input type="text" style={{ textAlign: 'right', width: "120px" }} placeholder="" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)} required /> */}
        <input type="number" style={{ textAlign: 'right', width: "120px" }}
          placeholder="" value={qty} name="Qty"
          onChange={handleQtyChange}
          required />

        {/* Rate */}
        <label style={{ fontWeight: 'bold' }}>Rate : </label>
        {/* <input type="text" style={{ textAlign: 'right', width: "120px" }} placeholder="" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)} required /> */}
        <input type="number" style={{ textAlign: 'right', width: "120px" }}
          placeholder="" value={rate} name="Rate"
          onChange={handleRateChange}
          required />

      </div>


      {/* <div style={{ marginLeft: '1px', marginRight: '20px' }}> */}

      {/* Amount */}
      {/* <label style={{ fontWeight: 'bold' }}>Amt. : </label> */}
      {/* <input type="text" style={{ textAlign: 'right', width: "120px" }} placeholder="" value={amount} name="amount" onChange={(e) => setAmount(e.target.value)} required /> */}
      {/* <input type="number" style={{ textAlign: 'right', width: "120px" }}
          placeholder="" value={amount} name="amount"
          onChange={handleAmtChange} required /> */}
      {/* </div> */}
      <span>  </span>
      {/* Remark */}
      <div style={{ marginLeft: '1px', marginRight: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Remark.: </label>
        <input style={{ width: "100%" }} type="text" placeholder="Enter Remark"
          value={debitrem} name="debitrem"
          onChange={(e) => setDebitRem(e.target.value)} required />
      </div>

      <button style={{ border: '2px solid ', height: '35px', width: '60px' }} title="Print Record" onClick={Prints} >
        Print
      </button>

      <button style={{ border: '2px solid ', height: '35px', width: '60px' }} title="Save" onClick={handleSaleOrderSave} >
        Save
      </button>

    </div>
  );
};

export default SalesOrderForm;