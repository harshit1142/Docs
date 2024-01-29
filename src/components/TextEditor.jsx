import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import './styles.css';
import io from 'socket.io-client'
import { useParams } from 'react-router-dom';

export default function TextEditor() {
 
    const {id:documentId}=useParams();
    const [socket,setSocket]=useState(null);
    const [quill,setQuill]=useState(null);

   
    useEffect( ()=> {
      setSocket(()=> io("http://localhost:4000"))
      
      return ()=>{
        if(socket!==null)
          socket.disconnect();
          console.log('user disconnected');
        }
    },[])
   
    useEffect(()=>{
       
       if(socket==null || quill==null) return
        function handler(delta, oldDelta, source){
            if (source !== 'user') return
            socket.emit('send-changes', delta)
        }
        
        quill.on('text-change',handler) 

        return ()=>{
            quill.off('text-change',handler)
        }
    }, [socket, quill])


    useEffect(() => {
        if (socket == null || quill == null) return
        function handler(delta) {
           quill.updateContents(delta)
        }

        socket.on("receive-changes", handler)

        return () => {
            socket.off('receive-changes', handler)
        }
    }, [socket, quill])
 
    useEffect(()=>{
        if (socket == null || quill == null) return
 
        socket.once("load-document",(document)=>{
           quill.setContents(document)
           quill.enable()
        })

        socket.emit('get-document',documentId)

    },[socket,quill,documentId])

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];

   const wrapperRef= useCallback((wrapper)=>{
    if(wrapper===null) return
    wrapper.innerHTML=""
    const editor=document.createElement("div")
    wrapper.append(editor)
   const q= new Quill(editor,{theme:'snow',modules:{toolbar:toolbarOptions}})
   q.disable()    
   q.setText("Loading ....")
   setQuill(q)
    },[])

  return (<>
      <div id="container" ref={wrapperRef}>
    </div>
     

  </>
  )
}
