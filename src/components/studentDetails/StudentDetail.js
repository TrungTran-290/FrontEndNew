import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Button, FormGroup, Label, Table } from "reactstrap";
import { uploadImage, getImages, deleteImage } from "../../redux/studentSlice";
import "./student.css";
import axios from "axios";

export default function StudentDetail() {
  const { id } = useParams();
  const { imagename, message, error, status } = useSelector(
    (state) => state.student
  );
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState({});
  const handle_change = (e) => {
    setFiles(e.target.files);
  };
  const handleDeleteImage =async (imageId) =>{
    const deleteImages = await dispatch(deleteImage(imageId));
  }
  const dispatch = useDispatch();
  const handle_submit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {git init
      await dispatch(uploadImage({id,formData})).unwrap();
      dispatch(getImages( id ));

      
    } catch (error) {
      console.error("Error uploading files", error);
    }
  };
  const fetchImage = async (imageURL) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/student/images/${imageURL}`, {
        responseType: "blob",
      });
      const imageObjectUrl = URL.createObjectURL(response.data);
      setImages((prev) => ({ ...prev, [imageURL]: imageObjectUrl }));
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };
  useEffect(() => {
    if (imagename) {
        imagename.forEach((item) => {
        fetchImage(item.imageURL);
      });
    }
  }, [imagename, dispatch]);
  
  useEffect(()=>{
    dispatch(getImages(id))
    
  },[dispatch,id])

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
      <Table>
        <thead>
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Image</th>
            </tr>
        </thead>
        <tbody>
        {imagename &&
        imagename.map((item, index) => (
          <tr key={index}>
            <th>{index + 1}</th>
            <td>{item.id}</td>
            <td className="center-image">
              <img
                src={images[item.imageURL]}
                style={{ width: "200px", height: "100px" }}
              ></img>
            </td>
            <td className="align-content-center">
              <Button className="btn btn-danger"onClick={()=>{handleDeleteImage(item.id)}}>Delete</Button>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
      
    </div>
  );
}
