import React, { useState } from 'react'
import {
    TextField, Button, RadioGroup, Radio,
    FormControlLabel, FormLabel, Checkbox, MenuItem,
    Select, InputLabel, FormControl, Typography
} from '@mui/material'
import { Styled } from './styled'

const FormApp = () => {
    const [form, setForm] = useState({
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

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === 'checkbox') {
            const updatedSubjects = checked
                ? [...form.subjects, value]
                : form.subjects.filter((subj) => subj !== value)
            setForm({ ...form, subjects: updatedSubjects })
        } else if (type === 'file') {
            setForm({ ...form, file: files[0] })
        } else {
            setForm({ ...form, [name]: value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        alert(JSON.stringify(form, null, 2))
    }

    const handleReset = () => {
        setForm({
            fname: '', lname: '', email: '', contact: '',
            gender: '', subjects: [], file: null,
            url: '', choice: '', about: ''
        })
    }

    return (
        <>
            <Styled.FormWrapper>
                <Typography variant="h5" align="center" color="green">Form in React</Typography>

                <form onSubmit={handleSubmit}>
                    <TextField label="First Name*" name="fname" fullWidth margin="normal" onChange={handleChange} value={form.fname} />
                    <TextField label="Last Name*" name="lname" fullWidth margin="normal" onChange={handleChange} value={form.lname} />
                    <TextField label="Enter Email*" name="email" type="email" fullWidth margin="normal" onChange={handleChange} value={form.email} />
                    <TextField label="Contact*" name="contact" fullWidth margin="normal" onChange={handleChange} value={form.contact} />

                    <FormLabel component="legend">Gender*</FormLabel>
                    <RadioGroup row name="gender" value={form.gender} onChange={handleChange}>
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>

                    <FormLabel component="legend">Your best Subject*</FormLabel>
                    <FormControlLabel control={<Checkbox value="English" checked={form.subjects.includes("English")} onChange={handleChange} />} label="English" />
                    <FormControlLabel control={<Checkbox value="Maths" checked={form.subjects.includes("Maths")} onChange={handleChange} />} label="Maths" />
                    <FormControlLabel control={<Checkbox value="Physics" checked={form.subjects.includes("Physics")} onChange={handleChange} />} label="Physics" />

                    <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                        Upload Resume*
                        <input type="file" hidden name="file" onChange={handleChange} />
                    </Button>

                    <TextField label="Enter URL*" name="url" fullWidth margin="normal" onChange={handleChange} value={form.url} />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select your choice</InputLabel>
                        <Select name="choice" value={form.choice} onChange={handleChange}>
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                            <MenuItem value="Maybe">Maybe</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="About"
                        name="about"
                        multiline
                        minRows={4}
                        fullWidth
                        margin="normal"
                        onChange={handleChange}
                        value={form.about}
                    />

                    <Styled.ButtonRow>
                        <Button variant="contained" color="success" onClick={handleReset}>Reset</Button>
                        <Button variant="contained" color="primary" type="submit">Submit</Button>
                    </Styled.ButtonRow>
                </form>
            </Styled.FormWrapper>
        </>
    )
}

export default FormApp
