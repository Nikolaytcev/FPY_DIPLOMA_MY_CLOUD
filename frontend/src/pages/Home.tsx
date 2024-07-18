import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from "react"
import { Loader } from '../components/Loader/Loader';
import { AppContext } from '../contexst/AppContexst';
import Cookies from 'universal-cookie';
import { Files } from '../components/Files/Files';

export const BASE_URL = import .meta.env.VITE_BASE_URL



interface IAuthForm {
  username: string,
  password: string
}

export const Home = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<IAuthForm>({username: '', password: ''});
  const [loading, setLoading] = useState<boolean>(true);
  const cookie = new Cookies();
  const { isLoggedIn, setIsLoggedIn, user, setUser, setIsFiles} = useContext(AppContext);

  const handleOnChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked: value
    }))
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    async function fetchData () {
    try {
      if (form.username !== '' && form.password !== '') {
        const res = await fetch(`${BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'X-CSRFToken': cookie.get('csrftoken'),
        },
        body: JSON.stringify(form)
        });
        if(!res.ok) {throw new Error(res.status.toString())}
        const resJson = await res.json()
        setIsLoggedIn(true);
        setUser(resJson);
        setLoading(false);
      }
    }
    catch(e) {
      if (e instanceof Error) {
        setLoading(false)
        alert('Login or password is not correct!')  
      }
    }    
  }
  fetchData()
  }

  const handleOnUsersList = () => {
    navigate('/users')
  }

  useEffect(() => {
    fetch(`${BASE_URL}/api/session`)
      .then(response => response.json())
      .then(response => {
        if (response.isauthenticated) {
          setUser({id: response.id, username: response.username, status: response.status})
          setIsLoggedIn(true)
        }
        setIsFiles(false)
        setLoading(false)
      })
  }, [])


  return (
    <>
      {loading ? <Loader/> : 
        !isLoggedIn ? 
        <div className='form-box'>
        <div className="btn-home">
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-primary me-md-2" type="button" onClick={() => {navigate('/registration')}}>Registration</button>
            <button className="btn btn-primary active" type="button" onClick={() => {navigate('/')}}>Authorization</button>
          </div>
        </div>
        <form onSubmit={handleOnSubmit}>
            <div className="mb-3">
              <input type="text" className="form-control" name='username' placeholder="Username" id="exampleInputUsername1" onChange={handleOnChangeForm}/>
            </div>
            <div className="mb-3">
              <input type="password" className="form-control" name='password' placeholder="" id="exampleInputPassword1"onChange={handleOnChangeForm}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </div> : 
        user.status === 'admin' ? 
          <>
            <div className="btn-home">
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className="btn btn-primary btn-lg" type="button" onClick={handleOnUsersList}>Users list</button>
              </div>
            </div>
            <Files/>
          </> : 
            <Files/>}   
    </>
  )
}
