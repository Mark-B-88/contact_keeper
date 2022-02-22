import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div>
            <h1>About This App</h1>
            <p className='my-1'>
                This is a full stack React app for keeping contacts
            </p>
            <p className='bg-dark p'>
                <strong>Version: </strong> 1.0.0
            </p>
            <div style={{ margin: '1rem 0' }}>
                <a>
                    <Link to='/'>Back to Dashboard</Link>
                </a>
            </div>
        </div>
    )
}

export default About