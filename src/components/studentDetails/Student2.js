import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { FormGroup, Label } from "reactstrap";
import { uploadImage } from "../../redux/studentSlice";

export default function StudentDetail2() {
    const {id} = useParams();
    const [files,setFiles]= useState();
    const handle_change =(e)=>{
        setFiles(e.target.files);
    }
    const dispatch = useDispatch();
    const handle_submit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        for(let i = 0 ; i<files.length;i++){
            formData.append("files",files[i]);
        }try{
            dispatch(uploadImage({id,formData}))
        }catch(error){
            console.error("Error uploading files",error)
        }
    }
  return (
    <div>
      <h1>Id: {id}</h1>
      <form onSubmit={handle_submit}>
        <FormGroup>
          <Label>Upload image</Label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handle_change}
          ></input>
          <input type="submit" value="save"></input>
        </FormGroup>{" "}
      </form>
    </div>
  );
}
