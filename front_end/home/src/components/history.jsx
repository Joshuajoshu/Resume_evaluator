import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';

function History() {
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      fetchChatHistory();
    }
  }, [location.state]);

  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.5:5000/get_chat_history', {
        mail: location.state.mail
      });
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setLoading(false);
    }
  };

  return (
    <Box style={{ height: '100vh', overflow: 'auto' }}> 
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Chat History
      </Typography>
      <div >
        <div >
          {loading ? (
            <CircularProgress />
          ) : (
            history.map((entry, index) => (
              <Box key={index} className="history-entry" sx={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold' }}>
                  Job Description: {entry.job_description}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Your Previous Responses: {entry.response}
                </Typography>
              </Box>
            ))
          )}
        </div>
      </div>
    </Box>
  );
}

export default History;
