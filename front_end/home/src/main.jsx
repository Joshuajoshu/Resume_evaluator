import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'


import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Resume_eval from './components/Resume_eval.jsx'
import History from './components/history.jsx'

const routes = createBrowserRouter([
    {path: "/", element: <App/>, children: [
        {path: "/login", element: <Login/>},
        {path: "/register", element: <Register/>},
        {path: "/resume_eval", element: <Resume_eval/>},
        {path: "/history", element: <History/>}
    ]}
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={routes}/>
)
