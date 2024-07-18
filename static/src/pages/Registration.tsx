import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"
import { Loader } from "../components/Loader/Loader";
import { BASE_URL } from "./Home";

interface Iform {
    username: string,
    password: string,
    email: string,
    first_name: string,
    last_name: string
  }

interface Ierror {
  username?: string[],
  password?: string[],
  email?: string[]
}
  
  export const Registration = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<Iform>({username: '', email: '', first_name: '', last_name: '', password: ''})
    const [res, setRes] = useState<Ierror>({username: [], password: [], email: []});
    const [status, setStatus] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
  
    const handleOnChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target
      setForm((prevForm) => ({
        ...prevForm,
        [name]: type === 'checkbox' ? checked: value
      }))
    }

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true);
      if (form.username !== '' && form.password !== '') {
        fetch(`${BASE_URL}/api/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        })
          .then(responce => {
            setStatus(responce.status);
            return responce.json() 
          })
          .then(responce => {
            setLoading(false)
            setRes(responce)
          })
        }
      }
    
    useEffect(() => {
      if (status !== 201 || status === undefined) {
        res.username !== undefined && res.username.length !== 0 ? alert(res.username) : '';
        res.email !== undefined && res.email.length !== 0 ? alert(res.email) : '';
        res.password !== undefined && res.password.length !== 0 ? alert(res.password) : '';
      }
    }, [res])
      
    return (
      <>
        {status === 201 ? <>
        <div className="registrated">
          <p className="h2">{`User ${res.username} is registrated!`}</p>
          <button className="btn btn-primary" type="button" onClick={() => {navigate('/')}}>Authorization</button>
        </div>
        </> : 
        loading ? <Loader/> : 
        <>
        <div className="btn-home">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-primary me-md-2" type="button" onClick={() => {navigate('/registration')}}>Registration</button>
            <button className="btn btn-primary active" type="button" onClick={() => {navigate('/')}}>Authorization</button>
          </div>
        </div>
          <form onSubmit={handleOnSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" name='username' placeholder="Username" id="exampleInputUsername1" onChange={handleOnChangeForm} />
            </div>
            <div className="input-group mb-3">
              <input type="text" className="form-control" name="last_name" placeholder="First name" aria-label="First name" id="first_name" onChange={handleOnChangeForm} />
              <span className="input-group-text">  </span>
              <input type="text" className="form-control" name="first_name" placeholder="Last name" aria-label="Last name" id="last_name"onChange={handleOnChangeForm} />
            </div>
            <div className="mb-3">
              <input type="email" className="form-control" name='email' placeholder="Email" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleOnChangeForm} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" name='password' placeholder="Password" id="exampleInputPassword1"onChange={handleOnChangeForm} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </>}
      </>
    )
  }
  