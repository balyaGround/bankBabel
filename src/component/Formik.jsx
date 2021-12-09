import React from "react";
import { useFormik } from "formik";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./formik.css";

function Form() {
  const Swal = require("sweetalert2");
  firebase.initializeApp(config);
  const db = firebase.firestore();
  const formik = useFormik({
    initialValues: {
      name: "",
      nik: "",
      email: "",
      mobile: "",
      gender: "",
      dob: "",
      pob: "",
      address: "",
      bloodtype: "",
      kabupatenkota: "",
      kecamatan: "",
      kelurahandesa: "",
      maritalstatus: "",
      nationality: "",
      province: "",
      religion: "",
      rtrw: "",
      workfield: "",
      expiry: "",
    },

    onSubmit: (values) => {
      console.log(values);
      db.collection("form").doc("user").set({
        name: values.name,
        nik: values.nik,
        email: values.email,
        mobile: values.mobile,
        gender: values.gender,
        dob: values.dob,
        pob: values.pob,
        address: values.address,
        province: values.province,
        bloodtype: values.bloodtype,
        nationality: values.nationality,
        rtrw: values.rtrw,
        workfield: values.workfield,
        religion: values.religion,
        kabupatenkota: values.kabupatenkota,
        kecamatan: values.kecamatan,
        kelurahandesa: values.kelurahandesa,
        expiry: values.expiry,
        maritalstatus: values.maritalstatus,
      });
      Swal.fire({
        icon: "success",
        title: "Data Submitted",
      });
    },
  });

  const retrieve = () => {
    db.collection("form")
      .doc("user")
      .get()
      .then((doc) => {
        const jsonData = doc.data();
        const jsonString = JSON.stringify(jsonData);
        console.log(jsonString);
        const json = JSON.parse(jsonString);
        formik.setValues({
          name: json.name,
          nik: json.nik,
          email: json.email,
          mobile: json.mobile,
          dob: json.dob,
          pob: json.pob,
          address: json.address,
          nationality: json.nationality,
          kelurahandesa: json.kelurahandesa,
          kecamatan: json.kecamatan,
          kabupatenkota: json.kabupatenkota,
          province: json.province,
          bloodtype: json.bloodtype,
          rtrw: json.rtrw,
          workfield: json.workfield,
          religion: json.religion,
          maritalstatus: json.maritalstatus,
          expiry: json.expiry,
          gender: json.gender,
        });
      });
  };

  return (
    <div id="wrapper">
      <form id="centered" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <div className="wrapper-luar">
          <div>
            <label htmlFor="nik">NIK</label>
            <input
              style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black", marginRight: "2px" }}
              type="number"
              id="nik"
              name="nik"
              required
              minLength="16"
              maxLength="16"
              onChange={formik.handleChange}
              value={formik.values.nik}
            />

            <label htmlFor="province">Provinsi</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="province" name="province" required onChange={formik.handleChange} value={formik.values.province} />

            <label htmlFor="name">Full Name</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="name" name="name" required onChange={formik.handleChange} value={formik.values.name} />

            <label htmlFor="pob">Place of Birth</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="pob" name="pob" required onChange={formik.handleChange} value={formik.values.pob} />

            <label htmlFor="dob">Date of Birth</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="dd-mm-yyyy" id="dob" name="dob" required onChange={formik.handleChange} value={formik.values.dob} />

            <label htmlFor="gender">Gender</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="gender" name="gender" required onChange={formik.handleChange} value={formik.values.gender} />

            <label htmlFor="bloodtype">Golongan Darah</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="bloodtype" name="bloodtype" required onChange={formik.handleChange} value={formik.values.bloodtype} />

            <label htmlFor="address">Address</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="address" name="address" required onChange={formik.handleChange} value={formik.values.address} />

            <label htmlFor="rtrw">RT/RW</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="rtrw" name="rtrw" required onChange={formik.handleChange} value={formik.values.rtrw} />
          </div>
          <div>
            <label htmlFor="kelurahandesa">Kel/Desa</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="kelurahandesa" name="kelurahandesa" required onChange={formik.handleChange} value={formik.values.kelurahandesa} />

            <label htmlFor="kecamatan">Kecamatan</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="kecamatan" name="kecamatan" required onChange={formik.handleChange} value={formik.values.kecamatan} />

            <label htmlFor="religion">Agama</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="religion" name="religion" required onChange={formik.handleChange} value={formik.values.religion} />

            <label htmlFor="maritalstatus">Status Perkawinan</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="maritalstatus" name="maritalstatus" required onChange={formik.handleChange} value={formik.values.maritalstatus} />

            <label htmlFor="workfield">Pekerjaan</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="workfield" name="workfield" required onChange={formik.handleChange} value={formik.values.workfield} />

            <label htmlFor="nationality">Kewarganegaraan</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="nationality" name="nationality" required onChange={formik.handleChange} value={formik.values.nationality} />

            <label htmlFor="expiry">Expiry Date</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="text" id="expiry" name="expiry" required onChange={formik.handleChange} value={formik.values.expiry} />

            <label htmlFor="email">Email</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px black" }} type="email" id="email" name="email" required onChange={formik.handleChange} value={formik.values.email} />

            <label htmlFor="mobile">Mobile</label>
            <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 3px black" }} type="tel" id="mobile" name="mobile" required onChange={formik.handleChange} value={formik.values.mobile} />
          </div>
        </div>
        <button type="submit" style={{ marginRight: "15px", borderRadius: "5%", marginLeft: "40px" }}>
          Submit
        </button>
        <button type="button" onClick={retrieve} style={{ marginRight: "15px", borderRadius: "5%" }}>
          Retrieve
        </button>
        <button type="reset" style={{ borderRadius: "5%" }}>
          Reset
        </button>
      </form>
    </div>
  );
}

export default Form;
