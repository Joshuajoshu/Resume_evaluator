import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios";
import { TextField, Button, Typography, Box } from '@mui/material';
import { useState } from "react";

const Register = () => {
  const[name,setName]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')

  async function submit(e){
    e.preventDefault();
    try {
      const resp=await axios.post ('http://192.168.1.5:5000/register',{
        name:name,
        email:email,
        password:password
      })
      .then(resp=>{
        if(resp.data.success==="Registered"){
          window.location.href = "/login";
        }
        else if(resp.data.success==="Exist"){
          alert("User Already exist use a different email id")
        }
        else{
          alert("something went wrong")
        }
      })

    }
    catch(e){
      console.log("Error:");
    }
  }
    
  return <div>
      <>
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={submit}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password (min 6 characters)"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          type="password"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Box>

      </>

  </div>
}

export default Register 