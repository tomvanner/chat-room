import React, { useState } from 'react';
import { 
    Button,
    makeStyles,
    TextField,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
}));

const Join = () => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField 
                label="Name" 
                variant="outlined" 
                onChange={(e) => setName(e.target.value)}
            />
            <TextField 
                label="Room" 
                variant="outlined" 
                onChange={(e) => setRoom(e.target.value)}
            />
            <Link 
                to={`/chat?name=${name}&room=${room}`}
                onClick={(e) => (!name || !room) ? e.preventDefault() : null}
            >
                <Button variant="contained" color="primary" type="submit">
                    Join
                </Button>
            </Link>
        </form>
    );
};

export default Join;