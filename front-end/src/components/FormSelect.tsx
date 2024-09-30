import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';
import { SxProps } from "@mui/material";
import FormLabel from './FormLabel';
import ButtonStyled from './ButtonStyled';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { FormControl, useFormControlContext } from '@mui/base/FormControl';
import { styled } from '@mui/system';
import clsx from 'clsx';

interface SelectProps {
    labelText: string;
    fields: { [key: string]: any };
    onChange:(e: SelectChangeEvent<string>) => void;
    name: string; // Adiciona a prop name para identificar o campo
}
export default function FormSelect(props: SelectProps) {

    return (
        <FormControl >
            <Label>{props.labelText}</Label>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ height: "39px", background: "white", width: "304px" }}
                onChange={props.onChange}
                name = {props.name} // Define a função de mudança 
            >
                {Object.entries(props.fields).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

const Label = styled(
    ({ children, className }: { children?: React.ReactNode; className?: string }) => {
        const formControlContext = useFormControlContext();
        const [dirty, setDirty] = React.useState(false);

        React.useEffect(() => {
            if (formControlContext?.filled) {
                setDirty(true);
            }
        }, [formControlContext]);

        if (formControlContext === undefined) {
            return <p>{children}</p>;
        }

        const { error, required, filled } = formControlContext;
        const showRequiredError = dirty && required && !filled;

        return (
            <p className={clsx(className, error || showRequiredError ? 'invalid' : '')}>
                {children}
                {required ? ' *' : ''}
            </p>
        );
    },
)`
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    margin-bottom: 4px;
    width: 304px; 
  
    &.invalid {
      color: red;
    }
  `;