import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { 
    Box,
    Button,
    Grid,
    makeStyles,
    TextField,
} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    messageBox: {
        marginRight: 5
    },
    messageButton: {
        position: "relative",
        top: 10
    },
}));

let socket;

const Chat = ({ location }) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');


    const ENDPOINT = 'localhost:5000';

    // Connect user to room
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);
        socket = io(ENDPOINT);
        setName(name);
        setRoom(room);
        
        socket.emit('join', { name, room }, () => {});
        
        return () => {
            socket.emit('disconnect');
            socket.off();
        };        
    }, [ENDPOINT, location.search]);
    
    // Receive a message
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    console.log(message, messages)

    return (
        <Box>
            <TextField 
                label="Message" 
                variant="outlined" 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                className={classes.messageBox}
            />
            <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                className={classes.messageButton}
            >
                Send
            </Button>
        </Box>
    );
};

export default Chat;