import jsPDF from 'jspdf'
import React, { useState } from 'react'
import {
    TextField, Button, RadioGroup, Radio,
    FormControlLabel, FormLabel, Checkbox, MenuItem,
    Select, InputLabel, FormControl, Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import { Styled } from './styled'
import { toast } from 'react-toastify'

const FormApp = () => {
    const [form, setForm] = useState({
        fname: '',
        lname: '',
        email: '',
        contact: '',
        gender: 'Male',
        subjects: [],
        file: null,
        url: '',
        choice: 'Yes',
        about: ''
    })
    const [openModal, setOpenModal] = useState(false)
    const [formErrors, setFormErrors] = useState({})

    const getValidationError = (name, value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return 'This field is required'
        }

        switch (name) {
            case 'fname':
            case 'lname':
                if (value.trim().length < 3) return 'Minimum 3 characters required'
                break
            case 'email':
                if (!/^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/.test(value))
                    return 'Invalid email'
                break
            case 'contact':
                if (!/^\d{10}$/.test(value)) return 'Must be 10 digits'
                break
            case 'url':
                if (!/^https?:\/\/.+$/.test(value)) return 'Enter a valid URL'
                break
            default:
                break
        }

        return ''
    }

    const validateField = (name, value) => {
        const error = getValidationError(name, value)
        setFormErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === 'checkbox') {
            const updatedSubjects = checked
                ? [...form.subjects, value]
                : form.subjects.filter(subj => subj !== value)
            setForm(prev => ({ ...prev, subjects: updatedSubjects }))
        } else if (type === 'file') {
            setForm(prev => ({ ...prev, file: files[0] }))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }

        if (name) validateField(name, type === 'file' ? files[0] : value)
    }

    const handleSubmit = (e) => {
        // console.log("submit clicked");

        e.preventDefault()

        const requiredFields = ['fname', 'lname', 'email', 'contact', 'url']
        let localErrors = {}
        let hasError = false

        requiredFields.forEach(field => {
            const value = form[field]
            const error = getValidationError(field, value)
            if (error) {
                localErrors[field] = error
                hasError = true
            }
        })

        if (
            !form.gender ||
            form.subjects.length === 0 ||
            !form.file ||
            !form.choice ||
            !form.about.trim()
        ) {
            hasError = true
            toast.error('Please fill in all required fields')
        }

        if (!form.subjects.length) {
            localErrors.subjects = 'Please select at least one subject'
            hasError = true
        }

        if (!form.about.trim()) {
            localErrors.about = 'This field is required'
            hasError = true
        }

        if (!form.choice) {
            localErrors.choice = 'Please select a choice'
            hasError = true
        }

        if (!form.file) {
            localErrors.file = 'Please upload your resume'
            hasError = true
        } else {
            const allowedExtensions = ['pdf', 'doc', 'docx']
            const fileExtension = form.file.name.split('.').pop().toLowerCase()

            if (!allowedExtensions.includes(fileExtension)) {
                localErrors.file = 'Only PDF or DOC files are allowed'
                hasError = true
            }

            if (form.file.size > 2 * 1024 * 1024) {
                localErrors.file = 'File size must be under 2MB'
                hasError = true
            }
        }

        setFormErrors(localErrors)
        if (hasError) {
            toast.error('Please fix the highlighted errors before submitting')
            return
        }

        if (hasError) {
            setFormErrors(localErrors)
            toast.error('Please fix the highlighted errors before submitting')
            return
        }

        toast.success('Form submitted successfully 🎉')
        setOpenModal(true)
        console.log('Form Submitted:', form)

    }

    const handleReset = () => {
        setForm({
            fname: '', lname: '', email: '', contact: '',
            gender: 'Male', subjects: [], file: null,
            url: '', choice: '', about: ''
        })
        setFormErrors({})
    }


    const handleExportJSON = () => {
        const dataStr = JSON.stringify(form, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'form_data.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    const handleExportPDF = () => {
        const doc = new jsPDF()
        doc.setFontSize(12)
        doc.text('React Form Submission Summary', 10, 10)

        const lines = [
            `First Name: ${form.fname}`,
            `Last Name: ${form.lname}`,
            `Email: ${form.email}`,
            `Contact: ${form.contact}`,
            `Gender: ${form.gender}`,
            `Subjects: ${form.subjects.join(', ')}`,
            `Resume: ${form.file?.name || 'N/A'}`,
            `URL: ${form.url}`,
            `Choice: ${form.choice}`,
            `About: ${form.about}`
        ]

        lines.forEach((line, i) => {
            doc.text(line, 10, 20 + i * 10)
        })

        doc.save('form_data.pdf')
    }


    return (
        <>
            <Styled.FormWrapper>
                <Typography variant="h5" align="center" color="green">Form in React</Typography>


                <div>
                    This project is a production-ready, advanced React form built using Vite, Material UI (MUI), and Styled-Components, showcasing modern React patterns and professional-grade UX.
                </div>

                <div className="featuresUseCasesWrapper">
                    <div className='features'>
                        Features:
                        <ul>
                            <li>✅ Vite + React — lightning-fast development setup</li>
                            <li>🎨 Material UI + Styled-Components — consistent, elegant styling</li>
                            <li>🔍 Real-time validation — custom error handling using regex & logic</li>
                            <li>📂 Resume upload — supports .pdf, .doc, .docx with size checks</li>
                            <li>📌 Multiple fields — radio, checkbox, dropdown, textarea, and file input</li>
                            <li>📋 Modal summary — clean modal popup on successful submission</li>
                            <li>📥 Export Options:</li>
                            <li>📄 PDF — generates and downloads a summary PDF via jsPDF</li>
                            <li>🗂️ JSON — downloads structured .json of form data</li>
                            <li>🔁 Reset functionality — clears all inputs and errors</li>
                            <li>🧪 Error feedback — form field-specific inline error messages</li>
                            <li>💬 Toastify notifications — instant feedback with react-toastify</li>
                            <li>🌐 URL validation — strict check for valid URLs</li>
                            <li>📱 Responsive layout — clean experience across devices</li>
                            <li>🧠 React Hooks (useState) — state-driven dynamic form behavior</li>
                        </ul>
                    </div>

                    <div className='useCases'>
                        🧠 Use-Cases:
                        <ul>
                            <li>Candidate onboarding forms</li>
                            <li>Registration or feedback portals</li>
                            <li>Resume submission pages</li>
                            <li>Real-time validated data collection</li>
                        </ul>

                        <br /><br />

                        <ul>
                            <li>GitHub: <a href="https://github.com/a2rp/react-form-app" target="_blank">github.com/a2rp/react-form-app</a></li>
                            <li>Live: <a href="https://a2rp.github.io/react-form-app/" target="_blank">a2rp.github.io/react-form-app/</a></li>
                        </ul>
                    </div>

                </div>


                <Styled.Form onSubmit={handleSubmit}>
                    <Styled.InputsWrapper>
                        <TextField
                            label="First Name*"
                            name="fname"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={form.fname}
                            className='input'
                            error={!!formErrors.fname}
                            helperText={formErrors.fname}
                        />
                        <TextField
                            label="Last Name*"
                            name="lname"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={form.lname}
                            className='input'
                            error={!!formErrors.lname}
                            helperText={formErrors.lname}
                        />
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <TextField
                            label="Enter Email*"
                            name="email"
                            type="email"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={form.email}
                            className='input'
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                        <TextField
                            label="Contact*"
                            name="contact"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={form.contact}
                            className='input'
                            error={!!formErrors.contact}
                            helperText={formErrors.contact}
                        />
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <div className='input'>
                            <FormLabel component="legend">Gender*</FormLabel>
                            <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                <FormControlLabel value="Other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </div>
                        <div className='input'>
                            <FormLabel
                                component="legend"
                            >Your best Subject*</FormLabel>
                            <FormControlLabel
                                control={<Checkbox
                                    value="English"
                                    checked={form.subjects.includes("English")}
                                    onChange={handleChange} />}
                                label="English"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    value="Maths"
                                    checked={form.subjects.includes("Maths")}
                                    onChange={handleChange} />}
                                label="Maths"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    value="Physics"
                                    checked={form.subjects.includes("Physics")}
                                    onChange={handleChange} />}
                                label="Physics"
                            />
                            {formErrors.subjects && (
                                <Typography variant="caption" color="error">{formErrors.subjects}</Typography>
                            )}
                        </div>
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <Button
                            variant="outlined"
                            component="label"
                            className='uploadResumeButton'
                        >
                            Upload Resume*
                            <input
                                type="file"
                                hidden
                                name="file"
                                onChange={handleChange}
                                accept=".pdf,.doc,.docx"
                            />
                        </Button>
                        {form.file && (
                            <Typography variant="body2" color="textSecondary">
                                Uploaded: {form.file.name}
                            </Typography>
                        )}
                        {formErrors.file && (
                            <Typography variant="caption" color="error">{formErrors.file}</Typography>
                        )}
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <TextField
                            label="Enter URL*"
                            name="url"
                            fullWidth
                            margin="normal"
                            onChange={handleChange}
                            value={form.url}
                            className='input'
                            error={!!formErrors.url}
                            helperText={formErrors.url}
                        />
                        <FormControl
                            fullWidth
                            margin="normal"
                            className='input'
                            error={!!formErrors.choice}
                        >
                            <InputLabel>Select your choice</InputLabel>
                            <Select
                                name="choice"
                                value={form.choice}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                                <MenuItem value="Maybe">Maybe</MenuItem>
                            </Select>
                            {formErrors.choice && <Typography variant="caption" color="error">{formErrors.choice}</Typography>}
                        </FormControl>
                    </Styled.InputsWrapper>

                    <TextField
                        label="About*"
                        name="about"
                        multiline
                        minRows={4}
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={form.about}
                        error={!!formErrors.about}
                        helperText={formErrors.about}
                    />

                    <Styled.ButtonRow>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleReset}
                        >Reset</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >Submit</Button>
                    </Styled.ButtonRow>
                </Styled.Form>
            </Styled.FormWrapper>

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <DialogTitle>Submission Successful</DialogTitle>
                <DialogContent dividers>
                    <Typography><strong>First Name:</strong> {form.fname}</Typography>
                    <Typography><strong>Last Name:</strong> {form.lname}</Typography>
                    <Typography><strong>Email:</strong> {form.email}</Typography>
                    <Typography><strong>Contact:</strong> {form.contact}</Typography>
                    <Typography><strong>Gender:</strong> {form.gender}</Typography>
                    <Typography><strong>Subjects:</strong> {form.subjects.join(', ')}</Typography>
                    <Typography><strong>Resume:</strong> {form.file?.name}</Typography>
                    <Typography><strong>URL:</strong> <a href={form.url} target="_blank" rel="noopener noreferrer">{form.url}</a></Typography>
                    <Typography><strong>Choice:</strong> {form.choice}</Typography>
                    <Typography><strong>About:</strong> {form.about}</Typography>
                </DialogContent>
                <DialogActions
                    sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
                >
                    <div>
                        <Button onClick={handleExportJSON} color="secondary" sx={{ mr: 1 }}>Export JSON</Button>
                        <Button onClick={handleExportPDF} color="secondary">Export PDF</Button>
                    </div>
                    <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default FormApp
