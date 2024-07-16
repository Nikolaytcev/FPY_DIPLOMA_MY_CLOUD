import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexst/AppContexst';

export interface Ishare {
  fileId: number | undefined,
  setShareActive: (e: React.SetStateAction<boolean>) => void
}


export const ShareModal = (fileId: Ishare) => {

    const { setError } = useContext(AppContext)
    const [link, setLink] = useState<string>('')
    const navigate = useNavigate()


    const handleOnCopyTheLink = () => {
        navigator.clipboard.writeText(link)
        alert('link copied')
        fileId.setShareActive(false)
    }

    useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/share?id=${fileId.fileId}`)
        .then(response => response)
        .then(response => {
          if (response.status === 200) {
            setLink(response.url)
          }
          else {
            setError(response.status)
            navigate('/error')
            }
          })
    }, [])

    return (
        <div
          className="modal show"
          style={{ display: 'block', position: 'initial' }}
        >
          <Modal.Dialog>
            <Modal.Title>Copy the link</Modal.Title>
            <Modal.Body>
              <Link to={link}>{link}</Link>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => fileId.setShareActive(false)}>Close</Button>
              <Button variant="primary" onClick={handleOnCopyTheLink}>Copy the link</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      );
}
