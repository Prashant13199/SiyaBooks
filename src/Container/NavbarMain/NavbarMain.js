import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from "react-router-dom";
import logo from '../../Assets/logo2.png'
import './style.css'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { auth, database } from '../../firebase';

export default function NavbarMain({ setLoading }) {

    const [username, setUsername] = useState('')
    const [photo, setPhoto] = useState('')

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
        <Navbar className="navbar_mobile" fixed='bottom'>
            <Container>
                <Navbar.Brand>
                    <NavLink to='/' activeClassName="is-active" exact={true}>
                        <img
                            alt=""
                            src={logo}
                            className='logo_mobile_navbar'
                        />
                    </NavLink>
                </Navbar.Brand>
                <Nav>
                    <NavLink to='/library' className='nav_icon' activeClassName="is-active" exact={true}><ImportContactsOutlinedIcon fontSize='medium' /></NavLink>
                </Nav>
                <Nav>
                    <NavLink to='/bookmark' className='nav_icon' activeClassName="is-active" exact={true}><TurnedInNotOutlinedIcon fontSize='medium' /></NavLink>
                </Nav>
                <Nav>
                    <NavLink to='/finished' className='nav_icon' activeClassName="is-active" exact={true}><CheckCircleOutlineOutlinedIcon fontSize='medium' /></NavLink>
                </Nav>
                <Nav>
                    <NavLink to='/store' className='nav_icon' activeClassName="is-active" exact={true}><StorefrontOutlinedIcon fontSize='medium' /></NavLink>
                </Nav>
                <Nav>
                    <NavLink to='#' onClick={() => signOut()} className='nav_icon' activeClassName="is-active" exact={true}><img src={photo} className='user_img_mobile' /></NavLink>
                </Nav>
            </Container>
        </Navbar>
    )
}
