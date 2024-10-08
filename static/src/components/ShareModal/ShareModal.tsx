import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../contexst/AppContexst';
import { BASE_URL } from '../../pages/Home';

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
      fetch(`${BASE_URL}/api/share?id=${fileId.fileId}`)
        .then(response => response)
        .then(response => {
          if (response.status === 200) {
            return response.json()
          }
          else {
            setError(response.status)
            navigate('/error')
            }
          })
          .then(response => setLink(response.url))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
          className="modal show"
          style={{ display: 'block', position: 'initial' }}
        >
          <Modal.Dialog>
            <Modal.Title>Copy the link</Modal.Title>
            <Modal.Body>
              <Link to={'#'}>{link}</Link>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => fileId.setShareActive(false)}>Close</Button>
              <Button variant="primary" onClick={handleOnCopyTheLink}>Copy the link</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      );
}
