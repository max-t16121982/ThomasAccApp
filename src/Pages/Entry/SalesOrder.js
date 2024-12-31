import React, { useEffect, useState, Suspense } from "react";
import Select from "react-select"

const SalesOrder = () => {
    const [Company, setCompany] = useState([]);
    const [Account, setAcc] = useState([]);
    const [CompName, setCompanyName] = useState();
    const [AccName, setSelects] = useState();

    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState({ trnasid: "", Item_Name: "", Description: "", PCS: "0.00", Qty: "0.000", Per: "PCS", Rate: "0.00", Amount: "0.00" });
    const [editRowId, setEditRowId] = useState(null);
    const [startDate, setStartDate] = useState(localStorage.getItem('database').replace('sas', '').substring(0, 4) + '-04-01');
    const [refno, setRefNo] = useState('');
    const [vochno, setVochNo] = useState();
    const [ItemMst, setItemMst] = useState([]);
    const [ItemName, setItemName] = useState();


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
        const response = JSON.parse(localStorage.getItem("companymst"))
        setCompany(response)
        if (localStorage.getItem("companylst") != null) {
            setCompanyName({ value: JSON.parse(localStorage.getItem("companylst")).value, label: JSON.parse(localStorage.getItem("companylst")).label })
        } else {
            setCompanyName({ value: response[0].TrnasID, label: response[0].CoName })
        }

        // const acc = JSON.parse(localStorage.getItem("accmst"))
        // setAcc(acc)
    }, [])

    useEffect(() => {
        fetch('http://103.206.139.246:8081/ItemMaster', options)
            .then(res => res.json())
            .then(ItemMst => setItemMst(ItemMst))
            .catch(err => console.log(err))
    }, [])

    const [editFormData, setEditFormData] = useState({ trnasid: "", Item_Name: "", Description: "", PCS: "0.00", Qty: "0.000", Per: "PCS", Rate: "0.00", Amount: "0.00" });

    // Handle Add Row
    const handleAddRow = () => {
        if (newRow.Item_Name && newRow.Description && newRow.Amount) {
            setRows([...rows, { id: Date.now(), ...newRow }]);
            setNewRow({ trnasid: "", Item_Name: "", Description: "", PCS: "0.00", Qty: "0.000", Per: "PCS", Rate: "0.00", Amount: "0.00" });
        }
    };

    // Handle Edit Click
    const handleEditClick = (row) => {
        setEditRowId(row.id);
        setItemName({value: row.trnasid, label: row.Item_Name});
        setEditFormData({ trnasid: row.trnasid, Item_Name: row.Item_Name, Description: row.Description, PCS: row.PCS, Qty: row.Qty, Per: row.Per, Rate: row.Rate, Amount: row.Amount });
    };

    // Handle Save Row
    const handleSaveClick = () => {
        setRows(
            rows.map((row) =>
                row.id === editRowId ? { ...row, ...editFormData } : row
            )
        );
        setEditRowId(null);
    };

    // Handle Delete Row
    const handleDeleteClick = (rowId) => {
        setRows(rows.filter((row) => row.id !== rowId));
    };

    // Handle Input Changes
    const handleNewRowChange = (e) => {
        if (e.target != undefined) {
            setNewRow({ ...newRow, [e.target.name]: e.target.value });
        } else if (e.value != undefined) {
            setItemName(e);
            setNewRow({ ...newRow, trnasid: e.value, Item_Name: e.label });
        }
    };

    const handleEditFormChange = (e) => {
        if (e.target != undefined) {
            setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
                } else if (e.value != undefined) {
            setItemName(e);
            setEditFormData({ ...editFormData, trnasid: e.value, Item_Name: e.label });
        }         
        
    };

    const handleCompChange = (selectedCompOption) => {
        localStorage.setItem("companylst", JSON.stringify(selectedCompOption));
        setCompanyName(selectedCompOption);
        //console.log(`Option selected:`, selectedCompOption);
    }

    const handleChange = (selectedOption) => {
        setSelects(selectedOption);
        //console.log(`Option selected:`, selectedOption);
    }

    const Prints = () => {
        window.print()
    }

    return (
        <div>
            <h1>Sale Order</h1>
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

            <fieldset style={{ margin: '8px', border: '1px solid silver', padding: "8px" }}>
                <div >
                    <h4 style={{ padding: "2px", color: "blue" }}>Add Row</h4>
                    {/* <input
                        type="text"
                        name="ItemName"
                        placeholder="Item Name"
                        value={newRow.ItemName}
                        onChange={handleNewRowChange}
                    /> */}
                    {/* Item Name */}
                    <label style={{ fontWeight: 'bold' }} htmlFor="">Item Name  : </label>
                    <Select options={ItemMst.length == undefined && ItemMst.length == 0 ? null : ItemMst.map((i) => ({ value: i.TRNASID, label: i.ITEMNAME }))}
                        placeholder="Item Name"
                        style={{width: "200px"}}
                        name="ItemName"
                        value={ItemName}
                        onChange={handleNewRowChange}
                    ></Select>

                    <input
                        type="text"
                        name="Description"
                        style={{width: "200px"}}
                        placeholder="Description"
                        value={newRow.Description}
                        onChange={handleNewRowChange}
                    />
                    <input
                        type="number"
                        name="PCS"
                        placeholder="PCS"
                        style={{width: "100px"}}
                        value={newRow.PCS}
                        onChange={handleNewRowChange}
                    />
                    <input
                        type="number"
                        name="Qty"
                        placeholder="Qty"
                        style={{width: "100px"}}
                        value={newRow.Qty}
                        onChange={handleNewRowChange}
                    />
                    <input
                        type="text"
                        name="PER"
                        placeholder="Per"
                        style={{width: "100px"}}
                        value={newRow.Per}
                        onChange={handleNewRowChange}
                    />
                    <input
                        type="number"
                        name="Rate"
                        placeholder="Rate"
                        style={{width: "120px"}}
                        value={newRow.Rate}
                        onChange={handleNewRowChange}
                    />
                    <input
                        type="number"
                        name="Amount"
                        style={{width: "150px"}}
                        placeholder="Amount"
                        value={newRow.Amount}
                        onChange={handleNewRowChange}
                    />
                    <button onClick={handleAddRow}>Add</button>
                </div>
                <table border="1">
                    <thead>
                        <tr>
                            <th className="hidden-column"  style={{ border: '2px solid green', width: "10%", }}>trnasid</th>
                            <th style={{ border: '2px solid green', width: "30%", }}>ItemName</th>
                            <th style={{ border: '2px solid green', width: "30%", }}>Description</th>
                            <th style={{ textAlign: 'right', border: '2px solid green' }}>PCS</th>
                            <th style={{ textAlign: 'right', border: '2px solid green' }}>Qty</th>
                            <th style={{ textAlign: 'right', border: '2px solid green' }}>Per</th>
                            <th style={{ textAlign: 'right', border: '2px solid green' }}>Rate</th>
                            <th style={{ textAlign: 'right', border: '2px solid green' }}>Amount</th>
                            <th style={{ border: '2px solid green' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                {editRowId === row.id ? (
                                    <>
                                        {/* ItemName: "", Description: "", PCS: "0.00", Qty: "0.000", Per: "PCS", Rate: "0.00", Amount: "0.00" */}
                                        <td className="hidden-column" style={{ border: '2px solid green' }}>
                                            <input
                                                type="number"
                                                name="trnasid"
                                                value={editFormData.trnasid}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            {/* <input
                                                type="text"
                                                name="ItemName"
                                                value={editFormData.ItemName}
                                                onChange={handleEditFormChange}
                                            /> */}
                                            {/* Item Name */}
                                            <Select options={ItemMst.length == undefined && ItemMst.length == 0 ? null : ItemMst.map((i) => ({ value: i.TRNASID, label: i.ITEMNAME }))}
                                                placeholder="Item Name"
                                                name="ItemName_1"
                                                value={ItemName}
                                                onChange={handleEditFormChange}
                                            ></Select>
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="text"
                                                name="Description"
                                                value={editFormData.Description}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="number"
                                                name="PCS"
                                                value={editFormData.PCS}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="number"
                                                name="Qty"
                                                value={editFormData.Qty}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="text"
                                                name="PER"
                                                width={5}
                                                value={editFormData.Per}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="number"
                                                name="Rate"
                                                value={editFormData.Rate}
                                                onChange={handleEditFormChange}
                                                on
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <input
                                                type="number"
                                                name="Amount"
                                                value={editFormData.Amount}
                                                onChange={handleEditFormChange}
                                            />
                                        </td>
                                        <td style={{ border: '2px solid green' }}>
                                            <button onClick={handleSaveClick}>Save</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="hidden-column" style={{ border: '2px solid green' }}>{row.trnasid}</td>
                                        <td style={{ border: '2px solid green' }}>{row.Item_Name}</td>
                                        <td style={{ border: '2px solid green' }}>{row.Description}</td>
                                        <td style={{ textAlign: 'right', border: '2px solid green' }}>{row.PCS}</td>
                                        <td style={{ textAlign: 'right', border: '2px solid green' }}>{row.Qty}</td>
                                        <td style={{ border: '2px solid green' }}>{row.Per}</td>
                                        <td style={{ textAlign: 'right', border: '2px solid green' }}>{row.Rate}</td>
                                        <td style={{ textAlign: 'right', border: '2px solid green' }}>{row.Amount}</td>
                                        <td style={{ border: '2px solid green' }}>
                                            <button onClick={() => handleEditClick(row)}>Edit</button>
                                            <button onClick={() => handleDeleteClick(row.id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </fieldset>

        </div>
    );
};

export default SalesOrder;
//9429988707