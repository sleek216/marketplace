import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from '@mui/material'
import {useTranslation} from "react-i18next";

const CustomAlert = (props) => {
    const { type, text, sx } = props
    const {t} = useTranslation()
    return (
        <Alert 
            severity={type} 
            sx={{ 
                textTransform: 'none',
                ...sx
            }}
        >
            {t(text)}
        </Alert>
    )
}

CustomAlert.propTypes = {}

export default CustomAlert
