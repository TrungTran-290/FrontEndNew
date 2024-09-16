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
  search,
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
    xepLoai: "GIOI",
    ngaySinh: "2000-01-01",
  });
  const handleSearchByYear = () => {
    if (startYear && endYear) {
      dispatch(
        getStudentByNgaySinh({ namSinh1: startYear, namsinh2: endYear })
      );
    }
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };
  const handleSave = () => {
    console.log(student);
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
    xepLoai: "Giỏi",
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
      case "GIOI":
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
  const [studentSearch, setStudentSearch] = useState({
    xepLoai: "",
    ten: "",
    thanhPho: "",
    startYear: 2000,
    endYear: 2024,
  });
  useEffect(() => {
    dispatch(search(studentSearch));
  }, [studentSearch]);
  return (
    <Container>
      <ToastContainer />
      <Button color="primary" onClick={toggleSave}>
        Add New
      </Button>
      <Input onChange={(e) => handleSearch(e.target.value)} />
      <Modal isOpen={modalSave} toggleSave={toggleSave}></Modal>
      <h1>Total: {totalPages}</h1>
      <div className="searchAll">
        <div>
          <Input
            type="select"
            value={studentSearch.xepLoai}
            onChange={(e) => {
              setStudentSearch({
                ...studentSearch,
                xepLoai: e.target.value,
              });
            }}
          >
            <option>...</option>
            <option value="GIOI">Giỏi</option>
            <option value="KHA">Khá</option>
            <option value="TRUNG_BINH">Trunh Bình</option>
            <option value="YEU">Yếu</option>
          </Input>
        </div>
        <div className="my-3 d-flex">
          <Input
            type="number"
            value={studentSearch.startYear}
            onChange={(e) => {
              setStudentSearch({
                ...studentSearch,
                startYear: e.target.value,
              });
            }}
            className="mr-2"
          >
            <Input
              type="number"
              value={studentSearch.endYear}
              onChange={(e) => {
                setStudentSearch({
                  ...studentSearch,
                  endYear: e.target.value,
                });
              }}
              className="mr-2"
            ></Input>
          </Input>
          <Button>Search</Button>
        </div>
      </div>
      <Input
        type="text"
        className="my-3"
        value={studentSearch.ten}
        onChange={(e) => {
          setStudentSearch({
            ...studentSearch,
            ten: e.target.value,
          });
        }}
      ></Input>
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

      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Tên sinh viên</th>
            <th>Thành phố</th>
            <th>Ngày sinh</th>
            
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
                  <div>
                    {studentEdit.isEdit && item.id === studentEdit.id ? (
                      <Input
                        type="select"
                        value={convertToValue(EStudent.xepLoai)}
                        onChange={(e) =>
                          setEStudent({ ...EStudent, xepLoai: e.target.value })
                        }
                      >
                        <option>...</option>
                        <option value="GIOI">Giỏi</option>
                        <option value="KHA">Khá</option>
                        <option value="TRUNG_BINH">Trung bình</option>
                        <option value="YEU">Yếu</option>
                      </Input>
                    ) : (
                      convertToValue(item.xepLoai)
                    )}
                  </div>
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

                      <Link to={`/student-detail/${item.id}`}>
                        <Button className="btn btn-info">
                          <i class="fa-solid fa-info"></i>
                        </Button>
                      </Link>
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
                  value={student.xepLoai}
                  onChange={handleChange}
                >
                  <option>...</option>
                  <option value="GIOI">Giỏi</option>
                  <option value="KHA">Khá</option>
                  <option value="TRUNG_BINH">Trung bình</option>
                  <option value="YEU">Yếu</option>
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