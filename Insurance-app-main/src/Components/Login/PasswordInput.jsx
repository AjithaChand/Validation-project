import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import "./PasswordInput.css"

const PasswordInput = ({ value, onChange }) => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div>
            <TextField
                className='password-input'
                type={showPassword ? 'text' : "password"}
                label="Password"
                value={value}
                onChange={onChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                InputLabelProps={{
                    required: false 
                }}
            />
        </div>
    );
};

export default PasswordInput;
