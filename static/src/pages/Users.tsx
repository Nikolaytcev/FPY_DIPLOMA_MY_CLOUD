import { useContext, useEffect, useState } from "react"
import { Loader } from "../components/Loader/Loader";
import { AppContext } from "../contexst/AppContexst";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import imgIsActive from '../img/verified_user.png'
import imgIsNotActive from '../img/highlight_off.png'
import { Files } from "../components/Files/Files";

interface Iusers {
    id: number,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    is_staff: boolean,
    is_active: boolean,
    files: string
}


export const Users = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<Iusers[]>([{id: 0, username: '',first_name: '', last_name: '',  email: '', is_staff: false, is_active: false, files: ''}])
    const [elem, setElem] = useState<string>('');
    const [method, setMethod] = useState<string>('GET');

    const {setError, setIsFiles, isLoggedIn, user, isFiles} = useContext(AppContext);
    
    const cookies = new Cookies();

    const handleOnUsersFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
        const elem = e.currentTarget.id
        setElem(elem)
        setIsFiles(true)
    }

    const handleOnDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        const elem = e.currentTarget.id
        setElem(elem);
        setMethod('DELETE');
    }

    const handleOnChangeStaffStatus = (e: React.MouseEvent<HTMLButtonElement>) => {
        const elem = e.currentTarget.id
        setElem(elem);
        setMethod('PUT');
    }

    useEffect(() => {
        if (isLoggedIn && user.status === 'admin') {
            setLoading(true)
            async function fetchData () {
                try {
                    if (method === 'GET') {
                        const res = await fetch('http://127.0.0.1:8000/api/users')
                        if (!res.ok) {
                            setError(res.status)
                            navigate('/error')
                        }
                        const resJson = await res.json()
                        setUsers(resJson)
                        setLoading(false)
                    }
                    else if (method === 'DELETE'){
                        const res = await fetch(`http://127.0.0.1:8000/api/delete`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json;charset=utf-8',
                            'X-CSRFToken': cookies.get('csrftoken'),
                        },
                        body: JSON.stringify({'userId': elem})
                        });
                        if (!res.ok) {
                            setError(res.status)
                            navigate('/error')
                        }
                        setMethod('GET')
                    }
                    else {
                        const res = await fetch(`http://127.0.0.1:8000/api/staff-status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                                'X-CSRFToken': cookies.get('csrftoken'),
                            },
                            body: JSON.stringify({'userId': elem})
                        });
                        if (!res.ok) {
                            setError(res.status)
                            navigate('/error')
                        }
                            setMethod('GET')
                    }
                }
                catch(e) {
                    if (e instanceof Error) {
                    console.log(e)
                    }
                }     
            }
            fetchData() 
            }
        else {
            navigate('/');
        }
      }, [method])
    

  return (
    <>
    {loading ? <Loader/> : isFiles ? <Files id={elem}/> :
     users.length !== 1 ? 
        <table className="table table-bordered">
        <thead>
            <tr>
            <th scope="col">ID</th>
            <th scope="col">Username</th>
            <th scope="col">First name</th>
            <th scope="col">Last name</th>
            <th scope="col">email</th>
            <th scope="col">Is active</th>
            <th scope="col">Is admin</th>
            <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
        {users.map(u => u.id === user.id ? '' :
            <tr key={u.id}>
                <th scope="row">{u.id}</th>
                <td>{u.username}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.email}</td>
                {u.is_active ?
                <td>
                    <img className="icon" src={imgIsActive} alt="is_active" />
                </td> : 
                <td>
                    <img className="icon" src={imgIsNotActive} alt="is_not_active" />
                </td>
                }
                {u.is_staff ?
                <td>
                    <img className="icon" src={imgIsActive} alt="is_active" />
                </td> : 
                <td>
                    <img className="icon" src={imgIsNotActive} alt="is_not_active" />
                </td>
                }
                <td>
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary btn-sm" type="button" id={u.id.toString()} onClick={handleOnDelete}>Change active status</button>
                        <button className="btn btn-primary btn-sm" type="button" id={u.id.toString()} onClick={handleOnChangeStaffStatus}>Change admin status</button>
                        <button className="btn btn-secondary btn-sm" type="button" id={u.id.toString()} onClick={handleOnUsersFiles}>Files</button>
                    </div>
                </td>
            </tr>)}
        </tbody>
        </table>
    : ''
    }
    </> 
  )
}
