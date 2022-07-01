import { Box } from "@mui/material";
import Quill from 'quill';
import { useEffect, useState } from "react";
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';




const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];



const Editor = () => {
    const [socket , setSocket] = useState();
    const [quill , setQuill] = useState();


    useEffect(() => {
        const quillServer = new Quill('#editor', {
            modules:{
                toolbar : toolbarOptions
            },
            theme: 'snow'
          });
          setQuill(quillServer);
    },[]);

    useEffect(() => {
        const socketServer = io('http://localhost:9000');
        setSocket(socketServer);

        return () =>{
            socketServer.disconnect();
        }
    },[]);

    useEffect(() => {
        if(socket ===  null || quill === null) return;
        
        const handleChange = (delta,oldDelta,source) => {
            if(source !== 'user') return;

            socket.emit('send-changes' , delta);
        }

       quill &&  quill.on('text-change', handleChange);

       return () => {
           quill && quill.off('text-change' , handleChange);
        }
    } ,[quill, socket])

    useEffect(() => {
        if(socket ===  null || quill === null) return;
        
        const handleChange = (delta) => {
            quill.updateContents( delta);
        }

       socket &&  socket.on('receive-changes', handleChange);

       return () => {
        socket && socket.off('receive-changes' , handleChange);
        }
    } ,[quill, socket])

    return(
        <Box className="container" id = 'editor'>

        </Box>
    )
}

export default Editor;