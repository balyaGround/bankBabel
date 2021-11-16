import React from "react";
import { useFormik } from "formik";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";

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
        <label htmlFor="fullname">Full Name: </label>
        <input type="text" id="fullname" name="fullname" required onChange={formik.handleChange} value={formik.values.fullname} />
        <br />
        <br />

        <label htmlFor="nik">NIK: </label>
        <input type="number" id="nik" name="nik" required minLength="16" maxLength="16" onChange={formik.handleChange} value={formik.values.nik} />
        <br />
        <br />

        <label htmlFor="address">Address: </label>
        <input type="text" id="address" name="address" required onChange={formik.handleChange} value={formik.values.address} />
        <br />
        <br />

        <label htmlFor="email">Email: </label>
        <input type="email" id="email" name="email" required onChange={formik.handleChange} value={formik.values.email} />
        <br />
        <br />

        <label htmlFor="mobile">Mobile: </label>
        <input type="tel" id="mobile" name="mobile" required onChange={formik.handleChange} value={formik.values.mobile} />
        <br />
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

        <label htmlFor="pob">Place of Birth: </label>
        <input type="text" id="pob" name="pob" required onChange={formik.handleChange} value={formik.values.pob} />
        <br />
        <br />

        <label htmlFor="dob">Date of Birth: </label>
        <input type="date" id="dob" name="dob" required onChange={formik.handleChange} value={formik.values.dob} />
        <br />
        <br />

        <button type="submit">Submit</button>
        <button type="button" onClick={retrieve}>
          Retrieve
        </button>
        <button type="reset">Reset</button>
      </form>
    </div>
  );
}

export default Form;
