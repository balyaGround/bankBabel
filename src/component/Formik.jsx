import React from "react";
import { useFormik } from "formik";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./formik.css";
import Swal from 'sweetalert2'

function Form() {
  const Swal = require('sweetalert2')

  firebase.initializeApp(config);
  const db = firebase.firestore();
  const formik = useFormik({
    initialValues: {
      name: "",
      nik: "",
      email: "",
      mobile: "",
      gender: '',
      dob: "",
      pob: "",
      address: "",
      bloodtype: '',
      kabupatenkota: '',
      kecamatan: '',
      kelurahandesa: '',
      maritalstatus: '',
      nationality: '',
      province: '',
      religion: '',
      rtrw: '',
      workfield: '',
      expiry: ''
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
        maritalstatus: values.maritalstatus
      });
      // alert("Form submitted");
      Swal.fire({
        icon: 'success',
        title: 'Submitted',
      })
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
          gender: json.gender
        });
      });
  };

  return (
    <div id="wrapper">
      <form id="centered" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>

        <label htmlFor="nik" style={{ marginRight: "5px" }}>
          NIK:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="number" id="nik" name="nik" required minLength="16" maxLength="16" onChange={formik.handleChange} value={formik.values.nik} />
        <br />

        <label htmlFor='province' style={{ marginRight: '5px' }}>
          Provinsi: {''}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id='province' name='province' required onChange={formik.handleChange} value={formik.values.province} />
        <br />

        <label htmlFor="name" style={{ marginRight: "5px" }}>
          Full Name:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id="name" name="name" required onChange={formik.handleChange} value={formik.values.name} />
        <br />

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

        <label htmlFor='gender' style={{ marginRight: '5px' }}>
          Gender: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='gender' name='gender' required onChange={formik.handleChange} value={formik.values.gender} />
        <br />

        <label htmlFor='bloodtype' style={{ marginRight: '5px' }}>
          Golongan Darah: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='bloodtype' name='bloodtype' required onChange={formik.handleChange} value={formik.values.bloodtype} />
        <br />

        <label htmlFor="address" style={{ marginRight: "5px" }}>
          Address:{" "}
        </label>
        <input style={{ border: "2px solid black" }} type="text" id="address" name="address" required onChange={formik.handleChange} value={formik.values.address} />
        <br />

        <label htmlFor='rtrw' style={{ marginRight: '5px' }}>
          RT/RW: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='rtrw' name='rtrw' required onChange={formik.handleChange} value={formik.values.rtrw} />
        <br />

        <label htmlFor='kelurahandesa' style={{ marginRight: '5px' }}>
          Kel/Desa: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='kelurahandesa' name='kelurahandesa' required onChange={formik.handleChange} value={formik.values.kelurahandesa} />
        <br />

        <label htmlFor='kecamatan' style={{ marginRight: '5px' }}>
          Kecamatan: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='kecamatan' name='kecamatan' required onChange={formik.handleChange} value={formik.values.kecamatan} />
        <br />

        <label htmlFor='religion' style={{ marginRight: '5px' }}>
          Agama: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='religion' name='religion' required onChange={formik.handleChange} value={formik.values.religion} />
        <br />

        <label htmlFor='maritalstatus' style={{ marginRight: '5px' }}>
          Status Perkawinan: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='maritalstatus' name='maritalstatus' required onChange={formik.handleChange} value={formik.values.maritalstatus} />
        <br />

        <label htmlFor='workfield' style={{ marginRight: '5px' }}>
          Pekerjaan: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='workfield' name='workfield' required onChange={formik.handleChange} value={formik.values.workfield} />
        <br />

        <label htmlFor='nationality' style={{ marginRight: '5px' }}>
          Kewarganegaraan: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='nationality' name='nationality' required onChange={formik.handleChange} value={formik.values.nationality} />
        <br />

        <label htmlFor='expiry' style={{ marginRight: '5px' }}>
          Expiry Date: {''}
        </label>
        <input style={{ border: "2px solid black" }} type='text' id='expiry' name='expiry' required onChange={formik.handleChange} value={formik.values.expiry} />
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
