import React from "react";
import { useFormik } from "formik";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./formik.css";
function Form() {
  firebase.initializeApp(config);
  const db = firebase.firestore();
  const formik = useFormik({
    initialValues: {
      fullname: "",
      nik: "",
      email: "",
      mobile: "",
      // gender: '',
      dob: "",
      pob: "",
      address: "",
    },

    onSubmit: (values) => {
      console.log(values);
      // values.preventDefault()
      // const db = firebase.firestore()
      db.collection("form").doc("user").set({
        fullname: values.fullname,
        nik: values.nik,
        email: values.email,
        mobile: values.mobile,
        // gender: values.gender,
        dob: values.dob,
        pob: values.pob,
        address: values.address,
      });
      alert("Form submitted");
    },
  });

  const retrieve = () => {
    // const ektp = firebase.storage().ref('/ektp.jpg')
    // const selfieEktp = firebase.storage().ref('/selfieEktp.jpg')
    // ektp.getDownloadURL().then((url) => {})
    db.collection("form")
      .doc("user")
      .get()
      .then((doc) => {
        const jsonData = doc.data();
        // console.log(JSON.parse(jsonData.toString()));
        const jsonString = JSON.stringify(jsonData);
        console.log(jsonString);
        const json = JSON.parse(jsonString);
        formik.setValues({
          fullname: json.fullname,
          nik: json.nik,
          email: json.email,
          mobile: json.mobile,
          dob: json.dob,
          pob: json.pob,
          address: json.address,
        });
      });
  };

  return (
    <div id="wrapper">
      <form id="centered" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <label htmlFor="fullname" style={{ marginRight: "5px" }}>
          Full Name:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id="fullname" name="fullname" required onChange={formik.handleChange} value={formik.values.fullname} />
        <br />
        <label htmlFor="nik" style={{ marginRight: "5px" }}>
          NIK:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="number" id="nik" name="nik" required minLength="16" maxLength="16" onChange={formik.handleChange} value={formik.values.nik} />
        <br />
        <label htmlFor="address" style={{ marginRight: "5px" }}>
          Address:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id="address" name="address" required onChange={formik.handleChange} value={formik.values.address} />
        <br />
        <label htmlFor="email" style={{ marginRight: "5px" }}>
          Email:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="email" id="email" name="email" required onChange={formik.handleChange} value={formik.values.email} />
        <br />
        <label htmlFor="mobile" style={{ marginRight: "5px" }}>
          Mobile:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="tel" id="mobile" name="mobile" required onChange={formik.handleChange} value={formik.values.mobile} />
        <br />
        {/* <label htmlFor = 'gender'>Gender: </label>
                <select 
                id = 'gender' 
                name = 'gender'
                onChange = {formik.handleChange}
                value = {formik.values.gender}
                >
                <option value = 'Male'>Male</option>
                <option value = 'Female'>Female</option>
                </select>
                <br/>
                <br/> */}

        <label htmlFor="pob" style={{ marginRight: "5px" }}>
          Place of Birth:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id="pob" name="pob" required onChange={formik.handleChange} value={formik.values.pob} />
        <br />
        <label htmlFor="dob" style={{ marginRight: "5px" }}>
          Date of Birth:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="dd-mm-yyyy" id="dob" name="dob" required onChange={formik.handleChange} value={formik.values.dob} />
        <br />
        <button type="submit" style={{ marginRight: "2px" }}>
          Submit
        </button>
        <button type="button" onClick={retrieve} style={{ marginRight: "2px" }}>
          Retrieve
        </button>
        <button type="reset">Reset</button>
      </form>
    </div>
  );
}

export default Form;
