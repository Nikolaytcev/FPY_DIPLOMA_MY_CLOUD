import { useContext, useEffect, useState } from "react"
import { Ifile } from "../Files/Files"
import { AppContext } from "../../contexst/AppContexst"
import { Loader } from "../Loader/Loader"

interface IFilesList {
    userId: string,
    handleComeBack: () => void
}

export const FilesList = (info: IFilesList) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Ifile[]>([]) 

    const { setError } = useContext(AppContext)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/files?id=${info.userId}`)
         .then(response => {
          if (response.status === 200) {
            return response.json()
          }
         })
         .then(response => {
          setData(response.data)
          setLoading(false)})
         .catch(error => setError(error))
      }, [])

  return (
    <>
    {loading ? <Loader/> : 
    <table className="table table-bordered">
        <thead>
            <tr>
            <th scope="col">ID</th>
            <th scope="col">name</th>
            <th scope="col">size</th>
            <th scope="col">created_at</th>
            <th scope="col">last_load</th>
            <th scope="col">comment</th>
            <th scope="col">path</th>
            <th scope="col">link</th>
            <th scope="col">user</th>
            </tr>
        </thead>
        <tbody>
        {data.map(file => 
            <tr key={file.id}>
                <th scope="row">{file.id}</th>
                <td>{file.name}</td>
                <td>{file.size}</td>
                <td>{file.created_at}</td>
                <td>{file.last_load}</td>
                <td>{file.comment}</td>
                <td>{file.path}</td>
                <td>
                    <a rel="stylesheet" href={file.link}>{file.link}</a>
                </td>
                <td>{file.user}</td>
            </tr>)}
        </tbody>
        <button type="button" className="btn btn-primary btn-lg" onClick={info.handleComeBack}>Back</button>
    </table>
    }
</>
)}
