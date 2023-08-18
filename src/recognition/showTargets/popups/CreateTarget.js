import React, { useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import {
  Box,
  IconButton,
  Modal,
  Fade,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Grid,
} from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faCalendarDays } from '@fortawesome/free-solid-svg-icons'
import './../../RecognitionPopup.scss'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import MultiSelect from 'react-select';
import CreatableSelect from 'react-select';
import { useSelector } from 'react-redux'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'calc(100% - 30px)',
  maxWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '20px',
  p: 0,
}
let pointsToGiveOptions = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '75', label: '75' },
  { value: '100', label: '100' },
]

let displayPointsOptions = [];
let pointValue = 50
function CreateTarget({ formSubmitAction, pointsToGive }) {
  const [open, setOpen] = React.useState(false)
  const { employeeList } = useSelector(state => state.recognitionDashboard);
  const formik = useFormik({
    initialValues: {
      targetName: '',
      targetDescription: '',
      targetAssignEmployee: '',
      targetReward: '',
      targetDueDate: '',
    },
    validationSchema: Yup.object({
      targetName: Yup.string().required('Please enter Target Name'),
      targetDescription: Yup.string().required('Please enter Description'),
      targetAssignEmployee: Yup.mixed().required('Please Choose Employee'),
      targetReward: Yup.mixed().required('Please choose points')
        .test('fileType', 'Please select another option', (value) => {
          return (formik.values.targetAssignEmployee.length > 0) &&
            !!value &&
            Number(value.value) <=
            Math.floor(pointsToGive / formik.values.targetAssignEmployee.length) &&
            true
        }),
      targetDueDate: Yup.mixed().required('Please choose date'),
    }),
    onSubmit: (data) => {
      formSubmitAction(data);
      handleClose();
    },
  })
  const handleOpen = () => {
    setOpen(true)
    formik.resetForm()
    getPointToGiveList(formik.values.targetReward)
  }
  const handleClose = () => {
    setOpen(false)
    displayPointsOptions = []
  }
  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }
  const handleBadgeEmployeeChange = (newValue) => {
    formik.setFieldValue('targetAssignEmployee', newValue)
    displayPointsOptions = []
    getPointToGiveList(newValue)
  }
  const changePoint = (newValue) => {
    formik.setFieldValue('targetReward', newValue)
  }
  const getPointToGiveList = (employee) => {
    if (!!employee && employee.length > 0) {
      if (employee.length > 0) {
        let total = Math.floor(pointsToGive / employee.length)
        if (
          !!formik.values.targetReward &&
          Number(formik.values.targetReward.value) > total
        ) {
          formik.setFieldValue('targetReward', '')
        }
        for (let i in pointsToGiveOptions) {
          if (Number(pointsToGiveOptions[i].value) <= total) {
            displayPointsOptions.push(pointsToGiveOptions[i])
          }
        }
      }
    } else {
      for (let i in pointsToGiveOptions) {
        if (Number(pointsToGiveOptions[i].value) <= pointsToGive) {
          displayPointsOptions.push(pointsToGiveOptions[i])
        }
      }
    }
  }

  return (
    <div className="addTeamPopup">
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        className="btn-primary btn-full"
        onClick={handleOpen}
      >
        Create a Target
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        className="recognitionPopup"
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="popupHeader headerBlue">
              <Typography className="headerTitle">Create a Target</Typography>
              <IconButton
                className="whiteClose"
                aria-label="close"
                onClick={handleClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            </div>
            <div className="popupBody small">
              <form
                noValidate
                autoComplete="off"
                method="post"
                encType="multipart/form-data"
                onSubmit={formik.handleSubmit}
                onKeyDown={onKeyDown}

              >
                <div className="inputWrapRow">
                  <div className="cInputWrap">
                    <label>Target Name</label>
                    <TextField
                      placeholder="Enter Target Name"
                      variant="outlined"
                      className="d-textField"
                      name="targetName"
                      value={formik.values.targetName}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.targetName && formik.errors.targetName ? (
                      <p className="error-message">{formik.errors.targetName}</p>
                    ) : null}
                  </div>
                  <div className="cInputWrap">
                    <label>Description</label>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={6}
                      className="d-textArea"
                      placeholder="Your Message Here"
                      name="targetDescription"
                      value={formik.values.targetDescription}
                      onChange={formik.handleChange}
                    />
                    {formik.touched.targetDescription &&
                      formik.errors.targetDescription ? (
                      <p className="error-message">
                        {formik.errors.targetDescription}
                      </p>
                    ) : null}
                  </div>
                  <div className="cInputWrap ">
                    <label>Assign Employees</label>
                    <MultiSelect
                      name="AssignBadgeEmployee"
                      classNamePrefix="cMultiSelect"
                      value={formik.values.targetAssignEmployee}
                      onChange={handleBadgeEmployeeChange}
                      isClearable={true}
                      placeholder="Select"
                      options={employeeList.map((item) => {
                        return { value: item?.employee_id, label: item?.full_name }
                      })}
                      isMulti
                    />
                    {formik.touched.targetAssignEmployee &&
                      formik.errors.targetAssignEmployee ? (
                      <p className="error-message">
                        {formik.errors.targetAssignEmployee}
                      </p>
                    ) : null}
                  </div>
                  <div className="cInputWrap inputWrap-50">
                    <label>Target Reward</label>
                    <CreatableSelect
                      name="targetReward"
                      classNamePrefix="cMultiSelect"
                      placeholder="Choose Points"
                      options={displayPointsOptions}
                      value={formik.values.targetReward}
                      onChange={changePoint}
                      // menuIsOpen={true}
                      menuPlacement="auto"
                      // menuPosition="fixed"
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.targetReward && formik.errors.targetReward ? (
                      <p className="error-message">{formik.errors.targetReward}</p>
                    ) :
                      null
                    }
                  </div>
                  <div className="cInputWrap inputWrap-50">
                    <label>Due Date:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']} sx={{padding:'0px'}}>
                        <MobileDatePicker
                          className="cDatePicker"
                          placeholder={'Choose Date'}
                          value={formik.values.targetDueDate}
                          onChange={(selectedDate) =>
                            formik.setFieldValue('targetDueDate', new Date(selectedDate))
                          }
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    {formik.touched.targetDueDate &&
                      formik.errors.targetDueDate ? (
                      <p className="error-message">
                        {formik.errors.targetDueDate}
                      </p>
                    ) : null}
                  </div>
                </div>



                <div className="popupBtnWrap">
                  <Button
                    variant="text"
                    className={'btn-text decorationNone btn-xl'}
                    sx={{ padding: '0px', textDecoration: 'none' }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: '215px' }}
                    className="btn-primary btn-xl"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </div>

          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default CreateTarget
