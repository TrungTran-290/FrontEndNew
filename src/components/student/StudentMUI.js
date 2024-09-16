import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Box,
  Pagination,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getAlll,
  deleteStudentById,
  getStudentByName,
  saveStudent,
  editStudent,
  resetStatusAndMessage,
} from "../../redux/studentSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
export default function Student() {
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(
      getAlll({ currentPage, limit }),
      deleteStudentById,
      getStudentByName,
      saveStudent,
      editStudent
    );
  }, [currentPage, dispatch]);

  const handlePageClick = (event, value) => {
    setCurrentPage(value - 1); // MUI Pagination is 1-indexed
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
    if (modalSave) dispatch(resetStatusAndMessage());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      if (status === 200) {
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
          ngaySinh: EStudent.ngaySinh,
          xepLoai: EStudent.xepLoai,
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
      <Button variant="contained" color="primary" onClick={toggleSave}>
        Add New
      </Button>
      <Dialog open={modalSave} onClose={toggleSave}>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputLabel htmlFor="ten">Tên</InputLabel>
                <TextField
                  id="ten"
                  name="ten"
                  fullWidth
                  value={student.ten}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="thanhPho">Thành phố</InputLabel>
                <TextField
                  id="thanhPho"
                  name="thanhPho"
                  fullWidth
                  value={student.thanhPho}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="xeploai">Xếp loại</InputLabel>
                <Select
                  id="xeploai"
                  name="xepLoai"
                  fullWidth
                  value={student.xeploai} // Correct binding to state
                  onChange={handleChange} // Update state properly
                >
                  <MenuItem value="Giỏi">Giỏi</MenuItem>
                  <MenuItem value="Khá">Khá</MenuItem>
                  <MenuItem value="Trung bình">Trung bình</MenuItem>
                  <MenuItem value="Yếu">Yếu</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <InputLabel htmlFor="ngaySinh">Ngày sinh</InputLabel>
                <TextField
                  id="ngaySinh"
                  name="ngaySinh"
                  type="date"
                  fullWidth
                  value={student.ngaysinh} // Bind to the state
                  onChange={handleChange} // Ensure correct state update
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
          <Button onClick={toggleSave} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TextField
        label="Search"
        type="search"
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Tên sinh viên</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Thành phố</TableCell>
            <TableCell>Xếp loại</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students &&
            students.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <TextField
                      hidden
                      value={EStudent.id}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, id: e.target.value })
                      }
                    />
                  ) : (
                    item.id
                  )}
                </TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <TextField
                      value={EStudent.ten}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, ten: e.target.value })
                      }
                    />
                  ) : (
                    item.ten
                  )}
                </TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <TextField
                      value={EStudent.thanhPho}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, thanhPho: e.target.value })
                      }
                    />
                  ) : (
                    item.thanhPho
                  )}
                </TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <TextField
                      type="date"
                      value={EStudent.ngaySinh}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, ngaySinh: e.target.value })
                      }
                    />
                  ) : (
                    item.ngaySinh
                  )}
                </TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Select
                      value={convertToValue(EStudent.xepLoai)}
                      onChange={(e) =>
                        setEStudent({ ...EStudent, xepLoai: e.target.value })
                      }
                    >
                      <MenuItem value="Giỏi">Giỏi</MenuItem>
                      <MenuItem value="Khá">Khá</MenuItem>
                      <MenuItem value="Trung bình">Trung bình</MenuItem>
                      <MenuItem value="Yếu">Yếu</MenuItem>
                    </Select>
                  ) : (
                    item.xepLoai
                  )}
                </TableCell>
                <TableCell>
                  {studentEdit.isEdit && item.id === studentEdit.id ? (
                    <Button onClick={() => handle_save(item.id)}>Save</Button>
                  ) : (
                    <>
                      <Button
                        color="error"
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
                        <DeleteOutlineIcon />
                      </Button>
                      <Button onClick={() => handle_edit(item.id, item)}>
                        Edit
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageClick}
        color="primary"
      />
    </Container>
  );
}
