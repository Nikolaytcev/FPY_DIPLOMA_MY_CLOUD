import React, { useEffect, useState } from "react"
import Cookies from 'universal-cookie';

// interface Ifile {
//     file: File,
//     create_date: string,
//     load_date: string,
//     comment: string,
//     user: number
// }
const cookie = new Cookies();
const formData = new FormData();

export const Files = () => {
  const [form, setForm] = useState<{file: File | string, comment: string}>()

  const handleOnChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    const val: string = name === 'comment' ? value : '';
    const file = files !== null ? files[0] : form?.file !== undefined ? form.file : ''
    if (file !== undefined) {
      setForm({file: file, comment: val})
    }
  }

  const handleAddFile = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    formData.append('file', form?.file !== undefined ? form.file : '')
    formData.append('comment', form?.comment !== undefined ? form.comment : '')

    fetch('http://127.0.0.1:8000/api/add-file', 
        {  
        method: 'POST',    
        headers: {
            'X-CSRFToken': cookie.get('csrftoken') 
        },
        body: formData
        })
  }

  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/files')
     .then(response => response.json())
     .then(response => console.log(response))
     
  }, [])

  return (
    <div className="files-container">
        <div className="action">
            <button className="btn btn-primary me-md-2" type="button">Load file</button>
        </div>
        <form onSubmit={handleAddFile}>
        <div className="mb-3">
            <input className="form-control" name="file" type="file" id="formFile" onChange={handleOnChangeForm}/>
        </div>
        <div className="mb-3">
            <input type="text" className="form-control" name='comment' placeholder="your's comment" id="comment" onChange={handleOnChangeForm}/>
        </div>
            <button type="submit" className="btn btn-primary">Add file</button>
        </form>
    </div>
  )
}
