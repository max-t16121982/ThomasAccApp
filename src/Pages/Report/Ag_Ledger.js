import React, { useEffect, useState } from "react";
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import "./index.css";
//import server from './../../server.js'
import './../../App.css';
import Select from "react-select"
const AG_Ledger = () => {
  var [search, setSearch] = useState([])
  let filters = []
  const [Company, setCompany] = useState([]);
  const [Account, setAcc] = useState([]);
  const [data, setData] = useState([]);
  const [CompName, setCompanyName] = useState();
  const [AccName, setSelects] = useState();
  const [RefAccName, setRefAccSelects] = useState();
  let [startDate, setStartDate] = useState(localStorage.getItem('database').replace('sas', '').substring(0, 4) + '-04-01');
  const [endDate, setEndDate] = useState(localStorage.getItem('database').replace('sas', '').substring(4) + '-03-31');
  const [pendings, setChkPending] = useState(false);
  const [IsDisSearch, setIsSearch] = useState(false);
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

  // useEffect(async () => {
  //   const response = await fetch('http://103.206.139.246:8081/companymaster', options)
  //     .then(res => res.json())
  //     //.then(Company => setCompany(Company))
  //     .catch(err => console.log(err))
  //   if (response.length > 0) {
  //     setCompany(response)
  //     setCompanyName({ value: response[0].TrnasID, label: response[0].CoName })
  //   }

  // }, [])
  useEffect(() => {
    const response = JSON.parse(localStorage.getItem("companymst"))
    setCompany(response)
    if (localStorage.getItem("companylst") != null) {
      setCompanyName({ value: JSON.parse(localStorage.getItem("companylst")).value, label: JSON.parse(localStorage.getItem("companylst")).label })
    } else {
      setCompanyName({ value: response[0].TrnasID, label: response[0].CoName })
    }
  }, [])
  // useEffect(() => {
  //   fetch('http://103.206.139.246:8081/companymaster', options)
  //     .then(res => res.json())
  //     .then(Company => setCompany(Company))
  //     .catch(err => console.log(err))
  // }, [])

  // useEffect(() => {
  //   fetch('http://103.206.139.246:8081/sas', options)
  //     .then(res => res.json())
  //     .then(data => setData(data))
  //     .catch(err => console.log(err))
  // }, [])



  const handleChange = (selectedOption) => {
    setSelects(selectedOption);
    //console.log(`Option selected:`, selectedOption);
  }

  const handleRefAccChange = (selectedOption) => {
    setRefAccSelects(selectedOption);
    //console.log(`Option selected:`, selectedOption);
  }

  const handleCompChange = (selectedCompOption) => {
    setCompanyName(selectedCompOption);
    localStorage.setItem("companylst", JSON.stringify(selectedCompOption));
    //console.log(`Option selected:`, selectedCompOption);
  }

  const shoot = async () => {
    setIsSearch(true)
    if (CompName == undefined) {
      alert("Company Name is not found..")
      return null;
    }
    if (AccName == undefined) {
      alert("Account Name is not found..")
      return null;
    }
    if (startDate == undefined) {
      alert("From Date Name is not found..")
      return null;
    }

    if (endDate == undefined) {
      alert("To Date Name is not found..")
      return null;
    }

    if ((CompName != undefined) && (AccName != undefined) && (startDate != undefined) && (endDate != undefined)) {

      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "ipaddress": localStorage.getItem('ipaddress'),
          "port": localStorage.getItem('port'),
          "database": localStorage.getItem('database'),
          "comid": CompName.value,
          "accid": AccName.value,
          "refaccid": (RefAccName == undefined ? "" : RefAccName.value),
          "fromdate": startDate,
          "todate": endDate,
          "pending": pendings
        }),
      };

      var sasdata = await fetch('http://103.206.139.246:8081/ag_sas', options)
        .then(res => res.json())
        .catch(err => console.log(err))
      //sasdata = sasdata.sort((a, b) => b.slips - a.slips && new Date(a.acdate) - new Date(b.acdate));

      // filters = data.filter((a) => a.comid = CompName.value &&
      //   a.accid == AccName.value &&
      //   Number(a.acdate.substr(0, 10).replace(/-/g, "")) >= Number(startDate.replace(/-/g, "")) &&
      //   Number(a.acdate.substr(0, 10).replace(/-/g, "")) <= Number(endDate.replace(/-/g, ""))).sort((a, b) => new Date(a.acdate) - new Date(b.acdate));
      let bdlBal = 0
      let bdlTotBal = 0
      let bdlTotCr = 0
      let bdlTotDr = 0
      let bdlSlipTotCr = 0
      let bdlSlipTotDr = 0
      // for (let i = 0; i < filters.length; i++) {
      //   filters[i].balance = bdlBal + filters[i].dramount - filters[i].cramount
      //   bdlBal = bdlBal + filters[i].dramount - filters[i].cramount
      //   bdlTotBal = bdlBal
      //   bdlTotCr += filters[i].cramount
      //   bdlTotDr += filters[i].dramount
      // }
      // filters.push({ refacname: "Total", balance: bdlTotBal, cramount: bdlTotCr, dramount: bdlTotDr })
      // search = filters
      search = []
      var ictr = -1
      var strSlip = "ï"
      for (let i = 0; i < sasdata.length; i++) {
        if (strSlip != sasdata[i].slips) {
          if (strSlip != "ï") {
            ictr = ictr + 1
            search.push({ acdate: "", refacname: "Slip Dr. Total", balance: 0, cramount: " ", dramount: bdlSlipTotDr })
            ictr = ictr + 1
            search.push({ acdate: "", refacname: "Slip Cr. Total", balance: 0, cramount: bdlSlipTotCr, dramount: " " })



            ictr = ictr + 1
            search.push({ slips: " a " })
            search[ictr].refacname = "| "
            search[ictr].bill = ""
            search[ictr].acdate = ""
            search[ictr].dramount = " "
            search[ictr].cramount = " "
            search[ictr].balance = ""
            search[ictr].chequeno = ""
          }





          ictr = ictr + 1
          search.push({ slips: sasdata[i].slips })
          strSlip = sasdata[i].slips

          search[ictr].refacname = " Slip No.: " + strSlip
          search[ictr].bill = ""
          search[ictr].acdate = ""
          search[ictr].dramount = " "
          search[ictr].cramount = " "
          search[ictr].balance = ""
          search[ictr].chequeno = ""

          bdlSlipTotCr = 0
          bdlSlipTotDr = 0
        }
        ictr = ictr + 1
        search.push({ bill: sasdata[i].bill })
        search[ictr].refacname = sasdata[i].refacname
        search[ictr].slips = sasdata[i].slips
        search[ictr].acdate = sasdata[i].acdate
        search[ictr].dramount = sasdata[i].dramount
        search[ictr].cramount = sasdata[i].cramount
        sasdata[i].balance = bdlBal + sasdata[i].dramount - sasdata[i].cramount
        search[ictr].balance = sasdata[i].balance
        search[ictr].chequeno = sasdata[i].chequeno
        bdlBal = bdlBal + sasdata[i].dramount - sasdata[i].cramount
        bdlTotBal = bdlBal
        bdlTotCr += sasdata[i].cramount
        bdlTotDr += sasdata[i].dramount
        bdlSlipTotCr += sasdata[i].cramount
        bdlSlipTotDr += sasdata[i].dramount
      }
      search.push({ acdate: "", refacname: "Slip Dr. Total", balance: " ", cramount: " ", dramount: bdlSlipTotDr })
      search.push({ acdate: "", refacname: "Slip Cr. Total", balance: " ", cramount: bdlSlipTotCr, dramount: " " })
      search.push({ refacname: "Dr. Total", balance: 0, cramount: 0, dramount: bdlTotDr })
      search.push({ refacname: "Cr. Total", balance: 0, cramount: bdlTotCr, dramount: 0 })
      search.push({ refacname: "Total", balance: bdlTotBal, cramount: bdlTotCr, dramount: bdlTotDr })
      //search = sasdata
      setSearch(search)
      //alert("Sucessfull...")
      setIsSearch(false)
    }
  }
  const Prints = () => {
    window.print()
  }

  const sendWhatsAppMessage = () => {
    //const whatsappUrl = `https://wa.me/+918758471389&send?text=${encodeURIComponent(formattedDataForWhatsApp)}`;
    // html2canvas(search.current).then(canvas => {
    //   // Convert canvas to PNG base64 URL
    //   const imageUrl = canvas.toDataURL('image/png');

    //   // Construct the WhatsApp URL with the image data
    //   const whatsappUrl = `https://wa.me/?text=Check%20out%20this%20table!%0A${encodeURIComponent(imageUrl)}`;

    //   // Open WhatsApp with the generated URL
    //   window.open(whatsappUrl, '_blank');
    // });
    if (search.length == 0) {
      alert('The entry cannot be zero');
    } else {
      const AccFilter = Account.filter(acc => {
        return acc.TrnasID === AccName.value;
      });
      AccFilter[0].wappmob = (AccFilter[0].wappmob == 0 ? '' : (AccFilter[0].wappmob.length == 10 ? '+91' + AccFilter[0].wappmob : AccFilter[0].wappmob ))

      const whatsappUrl = `https://wa.me/` + AccFilter[0].wappmob + `?text=*Hi%20` + AccFilter[0].AcName.replace('&',' ')  + `*,%20your%20Ledger%20balance:%0A*` + search[search.length - 1].balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) + `*%20Can%20you%20provide%20an%20update%20on%20my%20current%20balance?%20if%20you%20have%20concerns%20about%20your%20account%20balance%20or%20any%20pending%20transactions,%20please%20revet%20us%20Thanks!`;
      window.open(whatsappUrl, '_blank');
    }
  };


  return (
    <div className="App" style={{ marginLeft: '10px', marginRight: '10px' }} >


      <h2>Agency Ledger Report</h2>
      <label style={{ fontWeight: 'bold' }} htmlFor="">Company Name  : </label>
      <Select options={Company.length == undefined && Company.length == 0 ? null : Company.map((i) => ({ value: i.TrnasID, label: i.CoName }))}
        onChange={handleCompChange}
        value={CompName}
      ></Select>

      <label style={{ fontWeight: 'bold' }} htmlFor="">Account Name  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleChange}
        value={AccName}
      ></Select>

      <label style={{ fontWeight: 'bold' }} htmlFor="">Ref. Account Name  : </label>
      <Select options={Account.length == undefined && Account.length == 0 ? null : Account.map((i) => ({ value: i.TrnasID, label: i.AcName }))}
        onChange={handleRefAccChange}
        value={RefAccName}
      ></Select>
      {/* <h1>AccId: {AccName} From Date : {startDate} End Date : {endDate} </h1> */}
      {/* <select className="from-control" name={AccName} id="subject" onChange={e => setSelects(e.target.value)}> Select:
                <option value="" selected="selected">Select Account Name</option>
                {Account.map((d, i) => (<option value={d.TrnasID}>{d.AcName}</option>))}
              </select>       <br></br>
        */}
      <label style={{ fontWeight: 'bold' }} htmlFor="datepicker">From Date  : </label>
      <input
        type="date"
        id="datepicker"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />
      <span>  </span>
      <input value={pendings} defaultChecked={false} type="checkbox" onChange={e => setChkPending(e.target.checked)} />
      <span> Pending</span>
      {/* //'2017-05-09'// */}
      <br></br>
      <label style={{ fontWeight: 'bold' }} htmlFor="datepicker">......To date      : </label>
      <input
        type="date"
        id="datepicker"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
      />
      <span>  </span>
      <button style={{ border: '2px solid ', height: '35px', width: '60px' }}
        title="Find Record" onClick={shoot} disabled={IsDisSearch} >
        Search
      </button>
      <span>  </span>
      <button style={{ border: '2px solid ', height: '35px', width: '60px' }} title="Print Record" onClick={Prints} >
        Print
      </button>
      <span>  </span>
      <button onClick={sendWhatsAppMessage}>
        <img src={"data:image/png;base64,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"} />
        WhatsApp</button>
      <span>  </span>
      <table style={{ border: '2px solid green' }} >
        <thead>
          <th style={{ border: '2px solid green' }}>Date</th>
          <th style={{ border: '2px solid green' }}>Bill No / Cheque No</th>
          <th style={{ border: '2px solid green' }}>Refrance Name</th>
          <th style={{ textAlign: 'right', border: '2px solid green' }}>Amount</th>
          <th style={{ textAlign: 'right', border: '2px solid green' }}>Balance</th>
          {/* <th>CrAmount</th> */}
        </thead>
        <tbody >
          {/* {data.filter((item) => { return AccName == undefined ? undefined : item.accid == AccName }).map((d) => ( */}
          {search.map((d) => (
            <tr key={d}>
              <td style={{ width: "10%", border: '2px solid green' }}>{d.acdate == '' || d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? '' : (new Date(d.acdate).getDate().toString().length == 1 ? "0" + new Date(d.acdate).getDate() : new Date(d.acdate).getDate())}{d.acdate == '' || d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? '' : '/'}{d.acdate == '' || d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? '' : ((new Date(d.acdate).getMonth() + 1).toString().length == 1 ? "0" + (new Date(d.acdate).getMonth() + 1).toString() : (new Date(d.acdate).getMonth() + 1).toString())}{d.acdate == '' || d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? '' : '/'}{d.acdate == '' || d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? '' : new Date(d.acdate).getFullYear().toString().substring(2)}</td>
              <td style={{ textAlign: 'center', width: "20%", border: '2px solid green' }}>{d.bill} {d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' || d.chequeno == "" ? '' : ''}  </td>
              {/* <td>{d.chequeno} + ' No.:' + {d.chequedate}</td> */}
              {/* <td></td> */}
              <td style={d.refacname.includes('Slip No.:') || d.refacname == 'Total' || d.refacname == 'Slip Cr. Total' || d.refacname == 'Slip Dr. Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? { fontWeight: 'bold', width: "30%", border: '2px solid green' } : { width: "30%", border: '2px solid green' }}>{d.refacname}</td>
              <td style={d.cramount == 0 ? { color: 'red', textAlign: 'right', width: "20%", border: '2px solid green' } : (d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' || d.refacname == 'Slip Cr. Total' || d.refacname == 'Slip Dr. Total' ? { fontWeight: 'bold', textAlign: 'right', width: "20%", border: '2px solid green' } : { textAlign: 'right', width: "20%", border: '2px solid green' })} >{d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' ? Number(d.dramount - d.cramount).toFixed(2) : (d.dramount == 0 ? (d.cramount == " " ? d.cramount : Number(d.cramount).toFixed(2)) : (d.dramount == " " ? d.dramount : Number(d.dramount).toFixed(2)))}</td>
              <td style={d.refacname == 'Total' || d.refacname == 'Cr. Total' || d.refacname == 'Dr. Total' || d.refacname == 'Slip Cr. Total' || d.refacname == 'Slip Dr. Total' ? { fontWeight: 'bold', textAlign: 'right', width: "20%", border: '2px solid green' } : { textAlign: 'right', width: "20%", border: '2px solid green' }}>{(d.cramount == " " && d.dramount == " " ? "" : Number(d.balance).toFixed(2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AG_Ledger;