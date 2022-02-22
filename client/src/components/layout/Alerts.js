import React, { useContext } from 'react'
import AlertContext from '../../context/alert/alertContext'

{/**
    This section is optional, you don't need to set up custom alerts,
    it's only here purely as an example. This won't work unless you
    take off the required fields on the register form.
*/}

const Alerts = () => {
    const alertContext = useContext(AlertContext)

    return (
        alertContext.alerts.length > 0 && alertContext.alerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
                <i className='fas fa-info-circle'></i> {alert.msg}
            </div>
        ))
    )
}

export default Alerts