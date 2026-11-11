import React, { useRef, useState } from 'react'
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

const createInitialForm = () => ({
    fname: '',
    lname: '',
    email: '',
    contact: '',
    gender: '',
    subjects: [],
    file: null,
    url: '',
    choice: '',
    about: ''
})

const getFileError = (file) => {
    if (!file) return 'Please select a resume file'
    const allowedExtensions = ['pdf', 'doc', 'docx']
    const fileExtension = file.name.split('.').pop().toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) return 'Only PDF, DOC or DOCX files are allowed'
    if (file.size > 2 * 1024 * 1024) return 'File size must be 2 MB or less'
    return ''
}

const FormApp = () => {
    const [form, setForm] = useState(createInitialForm)
    const [openModal, setOpenModal] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const fileInputRef = useRef(null)

    const getValidationError = (name, value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return 'This field is required'
        }

        switch (name) {
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter a valid email address'
                break
            case 'contact':
                if (!/^\d{10}$/.test(value)) return 'Must be 10 digits'
                break
            case 'url': {
                try {
                    const parsedUrl = new URL(value)
                    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
                        return 'Enter a valid HTTP or HTTPS URL'
                    }
                } catch {
                    return 'Enter a valid HTTP or HTTPS URL'
                }
                break
            }
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
            setFormErrors(prev => ({ ...prev, subjects: updatedSubjects.length ? '' : 'Please select at least one subject' }))
        } else if (type === 'file') {
            const file = files[0] || null
            setForm(prev => ({ ...prev, file }))
            setFormErrors(prev => ({ ...prev, file: file ? getFileError(file) : '' }))
        } else {
            setForm(prev => ({ ...prev, [name]: value }))
        }

        if (name && type !== 'file' && type !== 'checkbox') validateField(name, value)
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        const requiredFields = ['fname', 'lname', 'email', 'contact', 'url']
        const localErrors = {}

        requiredFields.forEach(field => {
            const value = form[field]
            const error = getValidationError(field, value)
            if (error) {
                localErrors[field] = error
            }
        })

        if (!form.subjects.length) {
            localErrors.subjects = 'Please select at least one subject'
        }

        const genderError = getValidationError('gender', form.gender)
        if (genderError) localErrors.gender = genderError

        if (!form.about.trim()) localErrors.about = 'This field is required'

        if (!form.choice) localErrors.choice = 'Please select a choice'

        const fileError = getFileError(form.file)
        if (fileError) localErrors.file = fileError

        setFormErrors(localErrors)
        const hasError = Object.values(localErrors).some(Boolean)
        if (hasError) {
            toast.error('Please fix the highlighted errors before submitting')
            return
        }

        toast.success('Form details are ready to review')
        setOpenModal(true)
    }

    const handleReset = () => {
        setForm(createInitialForm())
        setFormErrors({})
        setOpenModal(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }


    const handleExportJSON = () => {
        const { file, ...formFields } = form
        const exportData = {
            ...formFields,
            resume: file ? { name: file.name, size: file.size, type: file.type } : null
        }
        const dataStr = JSON.stringify(exportData, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'form_data.json'
        link.click()
        window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }

    const handleExportPDF = async () => {
        const { default: jsPDF } = await import('jspdf')
        const doc = new jsPDF()
        doc.setFontSize(12)
        doc.text('React Form Submission Summary', 10, 10)

        const lines = [
            ['First Name', form.fname],
            ['Last Name', form.lname],
            ['Email', form.email],
            ['Contact', form.contact],
            ['Gender', form.gender],
            ['Subjects', form.subjects.join(', ')],
            ['Resume filename', form.file?.name || 'N/A'],
            ['URL', form.url],
            ['Choice', form.choice],
            ['About', form.about]
        ]

        let cursorY = 20
        lines.forEach(([label, value]) => {
            const wrappedLines = doc.splitTextToSize(`${label}: ${value}`, 190)
            const blockHeight = wrappedLines.length * 7
            if (cursorY + blockHeight > 280) {
                doc.addPage()
                cursorY = 20
            }
            doc.text(wrappedLines, 10, cursorY)
            cursorY += blockHeight + 3
        })

        doc.save('form_data.pdf')
    }


    return (
        <>
            <Styled.FormWrapper>
                <div className="intro" id="features">
                    <Typography variant="h4" align="center" color="primary">Validated form workspace</Typography>
                    <p>Enter profile details locally, validate each field, review a summary and export it when ready. Nothing is sent to a server, and the selected resume file is never uploaded.</p>
                </div>
                <div className="featuresUseCasesWrapper">
                    <div className="features">
                        <strong>Included features</strong>
                        <ul>
                            <li>Real-time validation for required fields</li>
                            <li>Local PDF, DOC and DOCX file checks; only the filename is exported</li>
                            <li>Submission preview with JSON and PDF export</li>
                            <li>Responsive Material UI layout and toast feedback</li>
                        </ul>
                    </div>
                    <div className="useCases">
                        <strong>Useful for</strong>
                        <ul>
                            <li>Resume form prototypes with local file checks</li>
                            <li>Registration and feedback form prototypes</li>
                            <li>Client-side validation demonstrations</li>
                        </ul>
                    </div>
                </div>
                <Styled.Form id="form" noValidate onSubmit={handleSubmit}>
                    <Styled.InputsWrapper>
                        <TextField
                            label="First Name"
                            name="fname"
                            required
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 100 }}
                            onChange={handleChange}
                            value={form.fname}
                            className='input'
                            error={!!formErrors.fname}
                            helperText={formErrors.fname}
                        />
                        <TextField
                            label="Last Name"
                            name="lname"
                            required
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 100 }}
                            onChange={handleChange}
                            value={form.lname}
                            className='input'
                            error={!!formErrors.lname}
                            helperText={formErrors.lname}
                        />
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 254 }}
                            onChange={handleChange}
                            value={form.email}
                            className='input'
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                        <TextField
                            label="Contact (10 digits)"
                            name="contact"
                            type="tel"
                            required
                            fullWidth
                            margin="normal"
                            inputProps={{ inputMode: 'numeric', maxLength: 10 }}
                            onChange={handleChange}
                            value={form.contact}
                            className='input'
                            error={!!formErrors.contact}
                            helperText={formErrors.contact}
                        />
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <div className='input'>
                            <FormLabel id="gender-label" component="legend" required error={!!formErrors.gender}>Gender</FormLabel>
                            <RadioGroup row aria-labelledby="gender-label" name="gender" value={form.gender} onChange={handleChange}>
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                <FormControlLabel value="Other" control={<Radio />} label="Other" />
                            </RadioGroup>
                            {formErrors.gender && <Typography variant="caption" color="error">{formErrors.gender}</Typography>}
                        </div>
                        <div className='input'>
                            <FormLabel id="subjects-label" component="legend" required>Your best subject</FormLabel>
                            <div role="group" aria-labelledby="subjects-label">
                            <FormControlLabel
                            control={<Checkbox
                                    name="subjects"
                                    value="English"
                                    checked={form.subjects.includes("English")}
                                    onChange={handleChange} />}
                                label="English"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    name="subjects"
                                    value="Maths"
                                    checked={form.subjects.includes("Maths")}
                                    onChange={handleChange} />}
                                label="Maths"
                            />
                            <FormControlLabel
                                control={<Checkbox
                                    name="subjects"
                                    value="Physics"
                                    checked={form.subjects.includes("Physics")}
                                    onChange={handleChange} />}
                                label="Physics"
                            />
                            </div>
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
                            Choose Resume
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                name="file"
                                onChange={handleChange}
                                accept=".pdf,.doc,.docx"
                            />
                        </Button>
                        {form.file && (
                            <Typography variant="body2" color="textSecondary">
                                Selected: {form.file.name}
                            </Typography>
                        )}
                        {formErrors.file && (
                            <Typography variant="caption" color="error">{formErrors.file}</Typography>
                        )}
                    </Styled.InputsWrapper>

                    <Styled.InputsWrapper>
                        <TextField
                            label="URL"
                            name="url"
                            type="url"
                            required
                            fullWidth
                            margin="normal"
                            inputProps={{ maxLength: 2048 }}
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
                            required
                            error={!!formErrors.choice}
                        >
                            <InputLabel id="choice-label">Select your choice</InputLabel>
                            <Select
                                labelId="choice-label"
                                name="choice"
                                value={form.choice}
                                label="Select your choice"
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
                        label="About"
                        name="about"
                        required
                        multiline
                        minRows={4}
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={form.about}
                        inputProps={{ maxLength: 1000 }}
                        error={!!formErrors.about}
                        helperText={formErrors.about}
                    />

                    <Styled.ButtonRow>
                        <Button
                            variant="contained"
                            color="success"
                            type="button"
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
                <DialogTitle>Submission Ready to Review</DialogTitle>
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
