import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResumeEvaluator() {
  const location = useLocation();
  const navigate = useNavigate();

  const [pdfFile, setPdfFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleHistory = () => {
    navigate("/history", { state: { mail: location.state.mail } });
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleEvaluate = async () => {
    setLoading(true); // Set loading state to true
    try {
      const formData = new FormData();
      formData.append('pdf_file', pdfFile);

      const resp = await axios.post('http://192.168.1.5:5000/extract_text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axios.post('http://192.168.1.5:5000/resume_eval', {
        mail: location.state.mail,
        pdf_data: resp.data.text,
        job_description: jobDescription
      });
      setResponse(response.data.response);
    } catch (error) {
      console.error('Error evaluating resume:', error);
      setResponse('Error occurred while evaluating resume.');
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Hello {location.state.id}. Please upload your resume and the desired job description to evaluate
      </Typography>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <br />
      <TextField
        placeholder="Enter job description here..."
        multiline
        rows={5}
        fullWidth
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        margin="normal"
      />
      <br />
      <Button
        onClick={handleEvaluate}
        variant="contained"
        color="primary"
        disabled={loading} // Disable button when loading
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Show loading spinner
        sx={{ marginRight: '10px' }}
      >
        {loading ? 'Loading...' : 'Evaluate Resume'}
      </Button>
      <Button onClick={handleHistory} variant="contained" color="primary" sx={{ marginRight: '10px' }}>
        <NavLink to="/history" style={{ textDecoration: 'none', color: 'white' }}>History</NavLink>
      </Button>
      <Button onClick={handleLogout} variant="contained" color="primary">
        Log Out
      </Button>
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Response:
        </Typography>
        <Typography>{response}</Typography>
      </Box>
      <Outlet />
    </Box>
  );
}

export default ResumeEvaluator;
