import React, { useEffect, useState } from 'react'
import './style.css'
import { Link, useLocation } from 'react-router-dom'
import logo from '../../Assets/logo.png'
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { auth, database } from '../../firebase';
import { IconButton } from '@mui/material'
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import Add from '../Add/Add';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SidebarMain({ setLoading }) {

    const location = useLocation()
    const [username, setUsername] = useState('')
    const [photo, setPhoto] = useState('')

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
    }
    const handleShow = () => {
        setShow(true)
    }

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}`).on('value', snapshot => {
            setUsername(snapshot.val()?.username)
            setPhoto(snapshot.val()?.photo)
            setLoading(false)
        })
    }, [auth?.currentUser?.uid])

    const signOut = () => {
        auth.signOut().then(() => {
            localStorage.clear()
            window.location.replace('/')
        })
    }

    return (
        <>

            <Modal show={show} onHide={handleClose} centered size="md">
                <Modal.Body>
                    <div className='modal_header'>
                        <div className='modal_head'>Add Book to your library</div>
                        <IconButton onClick={() => handleClose()}><CloseIcon color='error' className="close_icon" /></IconButton>
                    </div>
                    <Add handleClose={handleClose} />
                </Modal.Body>
            </Modal>
            <div className='sidebar'>
                <div className='sidebar_column'>
                    <div>
                        <img src={logo} className='sidebar_logo' />
                        <div className='sidebar_head'>
                            Siya Books
                        </div>
                        <div className='sidebar_list'>
                            <Link to='/' className={location.pathname === '/' ? 'links activelink' : 'links'}><CottageOutlinedIcon className='icon' />Home</Link>
                        </div>
                        <div className='sidebar_list'>
                            <Link to='/store' className={location.pathname === '/store' ? 'links activelink' : 'links'}><StorefrontOutlinedIcon className='icon' />Book Store</Link>
                        </div>
                        <div className='sidebar_head'>
                            Library
                        </div>
                        <div className='sidebar_list'>
                            <Link to='/library' className={location.pathname === '/library' ? 'links activelink' : 'links'}><ImportContactsOutlinedIcon className='icon' />All</Link>
                        </div>
                        <div className='sidebar_list'>
                            <Link to='/bookmark' className={location.pathname === '/bookmark' ? 'links activelink' : 'links'}><TurnedInNotOutlinedIcon className='icon' />Want to read</Link>
                        </div>
                        <div className='sidebar_list'>
                            <Link to='/finished' className={location.pathname === '/finished' ? 'links activelink' : 'links'}><CheckCircleOutlineOutlinedIcon className='icon' />Finished</Link>
                        </div>
                        <div className='sidebar_list'>
                            <Link to='#' onClick={() => handleShow()} className={location.pathname === '/add' ? 'links activelink' : 'links'}><AddCircleOutlineOutlinedIcon className='icon' />Add to library</Link>
                        </div>
                    </div>
                    <div className='sidebar_footer'>
                        <img src={photo} className='user_img' />
                        <div className='username'>{username}</div>
                        <div><IconButton onClick={() => signOut()}><LogoutIcon fontSize='small' color='error' /></IconButton></div>
                    </div>
                </div>
            </div>
        </>
    )
}
