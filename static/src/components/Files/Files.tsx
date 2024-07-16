import Dropdown from 'react-bootstrap/Dropdown';
import React, { useContext, useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import { AppContext } from "../../contexst/AppContexst";
import { Loader } from "../Loader/Loader";
import { DropdownButton } from 'react-bootstrap';
import moment from 'moment';
import { ShareModal } from '../ShareModal/ShareModal';
import { useNavigate } from 'react-router-dom';


export interface Ifile {
    id: number,
    name: string,
    size: string,
    created_at: string,
    last_load: string,
    comment: string,
    path: string,
    link: string,
    user: number
}

interface Iid {
  id?: string
}
const cookie = new Cookies();
const formData = new FormData();

export const Files = (id: Iid) => {
  const [form, setForm] = useState<{file: File | string, comment: string}>()
  const [name, setName] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [data, setData] = useState<Ifile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadActive, setLoadActive] = useState<boolean>(false)
  const [fileActiveChange, setFileActiveChange] = useState<boolean>(false)
  const [status, setStatus] = useState<number>(0)
  const [fileId, setFileId] = useState<number>()
  const [shareActive, setShareActive] = useState<boolean>(false)

  const navigate = useNavigate()

  const {user, setError, setIsFiles} = useContext(AppContext)
  let userId = user.id

  if (id.id !== undefined) {
    userId = Number(id.id)
  }
 
  

  const handleOnChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    const val: string = name === 'comment' ? value : '';
    const file = files !== null ? files[0] : form?.file !== undefined ? form.file : ''
    if (file !== undefined) {
      setForm({file: file, comment: val})
    }
  }

  const handleOnChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setName(value)
  }

  const handleOnChangeFileComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    setComment(value)
  }

  const handleAddFile = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
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
      .then(response => response.status)
      .then(response => {
          if (response === 201) {
            setStatus(response)
            setLoading(false)
            setLoadActive(false)}
          else {
            setError(response)
            navigate('/error')
          }
      })
  }

  const handleChangeLoadActive = () => {
    setLoadActive(true)
  }

  const handleFileActiveChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const file_id = e.currentTarget.id
    setFileActiveChange(true)
    setFileId(Number(file_id))
  }

  const handleOnDeleteFile = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const file_id = e.currentTarget.id
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/delete-file?id=${file_id}`, 
      {  
      method: 'DELETE',    
      headers: {
          'X-CSRFToken': cookie.get('csrftoken') 
      }
      })
      .then(response => response.status)
      .then(response => {
          if (response === 204) {
            setStatus(response)
            setLoading(false)}
          else {
            setError(response)
            navigate('/error')
          }

      })
  }

  const handleOnClickBack = () => {
    if (id.id !== undefined) {
      setIsFiles(false)
    }
    else {
      setFileActiveChange(false)
      setLoadActive(false)
    }
  }

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fileInfo = data.filter(file => file.id === fileId)[0]
    name !== '' ? fileInfo.name = name : ''
    comment !== '' ? fileInfo.comment = comment : ''
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/change-file?id=${fileId}`, 
      {  
      method: 'PUT',    
      headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-CSRFToken': cookie.get('csrftoken') 
      },
      body: JSON.stringify(fileInfo)
      })
      .then(response => response.status)
      .then(response => {
          if (response === 201) {
            setStatus(response)
            setLoading(false)
            setFileActiveChange(false)
            setName('')
            setComment('')}
          else {
            setError(response)
            navigate('/error')
            }
      })
      .finally(() => setLoading(false))
  }

  const handleOnDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const file_id = e.currentTarget.id
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/change-file?id=${file_id}`, 
      {  
        method: 'PUT',    
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': cookie.get('csrftoken') 
        },
        body: JSON.stringify({loadTime: moment().format()})
        }
    )
      .then(response => response.status)
      .then(response => {
        if (response === 201) {
            setStatus(response)
            setLoading(false)
          }
        else {
          setError(response)
          navigate('/error')
        }
    })
    .finally(() => setLoading(false))
  }

  const handleOnShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const file_id = e.currentTarget.id
    setFileId(Number(file_id))
    setShareActive(true)
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/files?id=${userId}`)
     .then(response => {
      if (response.status === 200) {
        setStatus(response.status)
        return response.json()
      }
      else {
        setError(response.status)
        navigate('/error')
      }
     })
     .then(response => {
      setData(response.data)
      setLoading(false)})
  }, [status])

  return (
    <div className="files-container">
    {loading ? <Loader/> : shareActive ? <ShareModal fileId={fileId} setShareActive={setShareActive}/> : loadActive ? 
      <>
      <form onSubmit={handleAddFile}>
        <div className="mb-3">
          <input className="form-control" name="file" type="file" id="formFile" onChange={handleOnChangeForm}/>
        </div>
        <div className="mb-3">
            <input type="text" className="form-control" name='comment' placeholder="your's comment" id="comment" onChange={handleOnChangeForm}/>
        </div>
        <button type="submit" className="btn btn-primary">Add file</button>
      </form> 
      <div className='btn-back'>
        <button className="btn btn-primary" onClick={handleOnClickBack}>Back</button>
      </div> 
      </>
      : fileActiveChange ? <>
      <form onSubmit={handleOnChangeFile}>
        <div className="mb-3">
            <input type="text" className="form-control" name='file-name' defaultValue={data.filter(file => file.id === fileId)[0].name}
            id="file-name" onChange={handleOnChangeFileName}/>
        </div>
        <div className="mb-3">
            <input type="text" className="form-control" name='file-comment' defaultValue={data.filter(file => file.id === fileId)[0].comment} 
            id="file-comment" onChange={handleOnChangeFileComment}/>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary">Change file</button>
        </div>
      </form>
      <div className='btn-back'>
        <button className="btn btn-primary" onClick={handleOnClickBack}>Back</button>
      </div>
      </> : 
      <>
        <table className="table table-bordered">
        <thead>
            <tr>
            <th scope="col">file name</th>
            <th scope="col">size</th>
            <th scope="col">created_at</th>
            <th scope="col">last_load</th>
            <th scope="col">comment</th>
            <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
        {data.map(file =>
            <tr key={file.id}>
              <th scope="row">{file.name}</th>
              <td>{file.size}</td>
              <td>{file.created_at}</td>
              <td>{file.last_load}</td>
              <td>{file.comment}</td>
              <td>
                <DropdownButton id="dropdown-basic-button" title="Actions">
                  <Dropdown.Item href={file.link} onClick={handleOnDownload} id={file.id.toString()} download={file.name}>Download</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={handleOnDeleteFile} id={file.id.toString()}>Delete</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={handleOnShare} id={file.id.toString()}>Share</Dropdown.Item>
                  <Dropdown.Item href="#" onClick={handleFileActiveChange} id={file.id.toString()}>Change file</Dropdown.Item>
                </DropdownButton>
              </td>
            </tr>)}
        </tbody>
      </table>
      <div className="action-btn">
        {id.id !== undefined ? 
        <button className="btn btn-primary me-md-2" type="button" onClick={handleChangeLoadActive} hidden>Load file</button> : 
        <button className="btn btn-primary me-md-2" type="button" onClick={handleChangeLoadActive}>Load file</button>
        }   
      </div>
      {
      id.id !== undefined ?
      <div className='btn-back'>
        <button className="btn btn-primary" onClick={handleOnClickBack}>Back</button>
      </div>: ''
      }
    </>
      }
    </div>
  )
}
