import React, { useEffect, useState } from 'react';
const text_1 = () => {

  const options_txt = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "ipaddress": localStorage.getItem("ipaddress"),
      "port": localStorage.getItem("port"), "database": localStorage.getItem("database")
    }),
  };

  // // useEffect(() => {

  // //   const resp_txt = fetch('http://103.206.139.246:8081/txt', options_txt)
  // //     .then(res => res.json())
  // //     .catch(err => console.log(err))
  // //   if (resp_txt.length > 0) {
  // //   }

  // }, [])
  return (<></>);
};

export default text_1;