import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlll,
  deleteStudentById,
  getStudentByName,
  saveStudent,
  editStudent,
  resetStatusAndMessage,
  getStudentByNgaySinh,
  getStudentByXepLoai,
} from "../../redux/studentSlice";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
export default function Student() {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const dispatch = useDispatch();
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2001);
  const [xepLoai, setXepLoai] = useState();
  const { status, message, error } = useSelector((state) => state.student);
  const { totalPages, students } = useSelector((state) => state.student);
  const [student, setStudent] = useState({
    ten: "Lê Mèo",
    thanhPho: "HCM",
    xeploai: "Giỏi",
    ngaysinh: "2000-01-01",
  });
  const convertDateToYYYYMMDD = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const handleSearchByYear = () => {
    if (startYear && endYear) {
      dispatch(
        getStudentByNgaySinh({ namSinh1: startYear, namsinh2: endYear })
      );
    }
  };
  const handleSearchXeoLoai = () => {
    dispatch(getStudentByXepLoai(xepLoai));
  };
  const convertDateToDDMMYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };
  useEffect(() => {
    dispatch(
      getAlll({ currentPage, limit }),
      deleteStudentById,
      getStudentByName,
      saveStudent,
      editStudent
    );
  }, [currentPage, dispatch]);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = (studentId) => {
    dispatch(deleteStudentById(studentId));
    dispatch(getAlll({ currentPage, limit }));
  };
  const handleSearch = (textSearch) => {
    dispatch(getStudentByName(textSearch));
  };

  const [modalSave, setModalSave] = useState(false);
  const toggleSave = () => {
    setModalSave(!modalSave);
    if (modalSave) dispatch(resetStatusAndMessage);
  };

  // const convertDateToYYYYMMDD = (date) => {
  //   const [day, month, year] = date.split("-");
  //   return `${year}-${month}-${day}`;
  // };

  // const convertDateToDDMMYYYY = (date) => {
  //   const [year, month, day] = date.split("-");
  //   return `${day}-${month}-${year}`;
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "ngaysinh") {
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: value,
      }));
    }
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };
  const handleSave = () => {
    dispatch(saveStudent(student));
  };

  useEffect(() => {
    if (status) {
      if (status == 200) {
        toast.success(message);
        setModalSave(false);
      } else {
        toast.error(message);
      }
    }
  }, [status, message, getAlll]);
  const [EStudent, setEStudent] = useState({
    id: "",
    ten: "",
    thanhPho: "",
    ngaySinh: "",
    xepLoai: "",
  });
  const [studentEdit, setStudentEdit] = useState({ isEdit: false, id: "" });
  const handle_edit = (id, item) => {
    setStudentEdit({ isEdit: true, id });
    setEStudent(item);
  };
  const handle_save = (id) => {
    dispatch(
      editStudent({
        id,
        student: {
          ...EStudent,
          ngaySinh: EStudent.ngaySinh, // Sử dụng định dạng YYYY-MM-DD
          xepLoai: EStudent.xepLoai, // Sử dụng giá trị phù hợp với enum
        },
      })
    );
    setStudentEdit({ isEdit: false, id: "" });
  };
  const XepLoaiEnum = {
    GIOI: "Giỏi",
    KHA: "Khá",
    TRUNG_BINH: "Trung bình",
    YEU: "Yếu",
  };
  const convertToValue = (enumCode) => {
    switch (enumCode) {
      case "Gioi":
        return XepLoaiEnum.GIOI;
      case "KHA":
        return XepLoaiEnum.KHA;
      case "TRUNG_BINH":
        return XepLoaiEnum.TRUNG_BINH;
      case "YEU":
        return XepLoaiEnum.YEU;
      default:
        return null;
    }
  };
  return (
    <Container>
      <ToastContainer />
      <Button color="primary" onClick={toggleSave}>
        Add New
      </Button>
      <Modal isOpen={modalSave} toggleSave={toggleSave}></Modal>
      <h1>Total: {totalPages}</h1>

      <Row>
        <Col sm={4}>
          <Label for="startYear">Start Year</Label>
          <Input
            type="number"
            id="startYear"
            name="startYear"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        </Col>
        <Col sm={4}>
          <Label for="endYear">End Year</Label>
          <Input
            type="number"
            id="endYear"
            name="endYear"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
        </Col>
        <Col sm={4}>
          <Button color="primary" onClick={handleSearchByYear}>
            Search
          </Button>
        </Col>
      </Row>
      <Input
        id="xepLoai"
        name="xepLoai"
        type="select"
        value={xepLoai}
        onChange={(e) => handleSearchXeoLoai(e)}
      >
        <option>Giỏi</option>
        <option>Khá</option>
        <option>Trung bình</option>
        <option>Yếu</option>
      </Input>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Tên sinh viên</th>
            <th>Ngày sinh</th>
            <th>Thành phố</th>
            <th>Xếp loại</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((item, index) => (
              <tr
                key={index}
                className={
                  studentEdit.isEdit && item.id === studentEdit.id
                    ? "student-item active"
                    : "student-item"
                }
              >
                <th scope="row">{index + 1}</th>
                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Input
                      type="hidden"
                      value={EStudent.id}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, id: e.target.value })
                      }
                    />
                  ) : (
                    item.id
                  )}
                </td>
                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Input
                      type="text"
                      value={EStudent.ten}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, ten: e.target.value })
                      }
                    />
                  ) : (
                    item.ten
                  )}
                </td>
                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Input
                      type="text"
                      value={EStudent.thanhPho}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, thanhPho: e.target.value })
                      }
                    />
                  ) : (
                    item.thanhPho
                  )}
                </td>
                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Input
                      type="date"
                      value={EStudent.ngaySinh}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, ngaySinh: e.target.value })
                      }
                    />
                  ) : (
                    item.ngaySinh
                  )}
                </td>

                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Input
                      id="xepLoai"
                      name="xepLoai"
                      type="select"
                      value={convertToValue(EStudent.xepLoai)}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, xepLoai: e.target.value })
                      }
                    >
                      <option></option>
                      <option value="GIOI">Giỏi</option>
                      <option value="KHA">Khá</option>
                      <option value="TRUNG BINH">Trung bình</option>
                      <option value="YEU">Yếu</option>
                    </Input>
                  ) : (
                    convertToValue(item.xepLoai)
                  )}
                </td>
                <td>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Button
                      className="btn btn-success"
                      onClick={() => handle_save(item.id)}
                    >
                      Save{" "}
                    </Button>
                  ) : (
                    <>
                    <div className="Buttons_Icon">
                      <Button
                        className="btn btn-danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this student?"
                            )
                          ) {
                            handleDelete(item.id);
                          }
                        }}
                      >
                        <i className="fa-solid fa-delete-left"></i>
                      </Button>
                      <Button
                        className="btn btn-success"
                        onClick={() => handle_edit(item.id, item)}
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </Button>
                      <Button
                        className="btn btn-primary"
                      >
                        <Link className="nav-link" to={`/student-detail/${item.id}`}><i class="fa-regular fa-user"></i></Link>
                      </Button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(totalPages)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <div>
        <Modal isOpen={modalSave} toggleSave={toggleSave}>
          <ModalHeader toggleSave={toggleSave}>Modal title</ModalHeader>
          {error && (
            <Alert color="danger">
              <ul>
                {error.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}
          <ModalBody>
            <Form>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="ten">Tên</Label>
                    <Input
                      id="ten"
                      name="ten"
                      placeholder="gõ tên"
                      type="text"
                      value={student.ten}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="thanhPho">Thành phố</Label>
                    <Input
                      id="thanhPho"
                      name="thanhPho"
                      placeholder="Thành phố"
                      type="text"
                      value={student.thanhPho}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="xeploai">Xếp loại</Label>
                <Input
                  id="xeploai"
                  name="xepLoai"
                  type="select"
                  onChange={handleChange}
                >
                  <option value={student.xeploai}>Giỏi</option>
                  <option value={student.xeploai}>Khá</option>
                  <option value={student.xeploai}>Trung bình</option>
                  <option value={student.xeploai}>Yếu</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="exampleAddress2">Ngày sinh</Label>
                <Input
                  id="ngaySinh"
                  name="ngaySinh"
                  type="date"
                  onChange={handleChange}
                  value={student.ngaySinh}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={toggleSave}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Container>
  );
}
