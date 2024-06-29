import React, { useEffect, useState } from 'react'
import './style.css'
import { Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Modal } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import CircularProgress from '@mui/material/CircularProgress';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { auth, database } from '../../firebase';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkunreadIcon from '@mui/icons-material/Markunread';

export default function SingleBook({ bookName, bookURL, id }) {

    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [percentage, setPercentage] = useState(0)
    const [bookmarked, setBookmarked] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => {
        saveProgress()
        setShow(false)
        setPageNumber(1)
    }
    const handleShow = () => {
        setShow(true)
        fetch()
    }

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setShow2(false)
    }
    const handleShow2 = () => {
        setShow2(true)
    }

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).on('value', snapshot => {
            setPercentage(snapshot.val()?.percentage ? snapshot.val()?.percentage : 0)
            setBookmarked(snapshot.val()?.bookmark)
        })
    }, [auth?.currentUser?.uid, id])

    const fetch = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).on('value', snapshot => {
            setPageNumber(snapshot.val()?.lastPage ? snapshot.val().lastPage : 1)
        })
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const goToPrevPage = () => setPageNumber((prevPage) => prevPage - 1);
    const goToNextPage = () => setPageNumber((prevPage) => prevPage + 1);

    const saveProgress = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).update({
            lastPage: pageNumber, totalPage: numPages, percentage: Math.round((pageNumber / numPages) * 100, 2) > 0 ? Math.round((pageNumber / numPages) * 100, 2) : 0
        }).then(() => {
            console.log('Page Updated')
        }).catch((e) => console.log(e))
    }

    const handleBookmark = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).update({
            bookmark: !bookmarked
        }).then(() => console.log('Bookmarked')).catch((e) => console.log(e))
    }

    const handleDelete = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).remove().then(() => {
            console.log('Removed Book')
            handleClose2()
        }).catch((e) => console.log(e))
    }

    const handleUnread = () => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books/${id}`).update({
            lastPage: 0, totalPage: 0, percentage: 0
        }).then(() => {
            console.log('Unread Book')
            handleClose2()
        }).catch((e) => console.log(e))
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} fullscreen>
                <Modal.Body style={{ padding: 0, overflow: 'hidden' }}>
                    <div className='modal_header'>
                        <div>{bookName}</div>
                        <IconButton onClick={() => handleClose()}><CloseIcon color='error' className="close_icon" /></IconButton>
                    </div>
                    <div style={{ maxWidth: '900px', margin: 'auto', overflow: 'hidden' }}>
                        <div className='pdf_view' style={{ height: window.innerHeight - 100 }}>
                            {pageNumber && <center>
                                <Document file={bookURL} onLoadSuccess={onDocumentLoadSuccess} loading={<div className='loading'><CircularProgress /></div>}>
                                    <Page
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        customTextRenderer={false}
                                        pageNumber={pageNumber}
                                        height={window.innerHeight - 120}
                                    />
                                </Document>
                            </center>}
                        </div>
                        <div className='pdf_buttons'>
                            <IconButton disabled={pageNumber === 1} onClick={goToPrevPage}><ChevronLeftIcon color={pageNumber === 1 ? 'gray' : 'success'} /></IconButton>
                            <span className='page_number'>Page {pageNumber} of {numPages}</span>
                            <IconButton disabled={pageNumber === numPages} onClick={goToNextPage}><ChevronRightIcon color={pageNumber === numPages ? 'gray' : 'success'} /></IconButton>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show2} onHide={handleClose2} size='sm' centered>
                <Modal.Body style={{ overflow: 'hidden' }}>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleBookmark}>
                                <ListItemIcon>
                                    {bookmarked ? <BookmarkIcon color='success' /> : <BookmarkBorderIcon />}
                                </ListItemIcon>
                                <ListItemText primary={bookmarked ? "Remove Bookmark" : "Bookmark"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteIcon color='error' />
                                </ListItemIcon>
                                <ListItemText primary='Delete' />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleUnread}>
                                <ListItemIcon>
                                    <MarkunreadIcon />
                                </ListItemIcon>
                                <ListItemText primary='Unread' />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Modal.Body>
            </Modal>
            <Grid xs={2} sm={4} md={4} padding={1}>
                <div className='single_book'>
                    <img src={bookURL} className='single_book_img' onClick={() => handleShow()} />
                    <div className='book_details'>
                        <div>
                            <div className='single_book_name'>{bookName}</div>
                            <div className='book_details_2'>
                                {percentage !== 0 ? <div className='percentage_completion'>{percentage}%</div> : <div className='chip'>New</div>}
                            </div>
                        </div>
                        <div>
                            <IconButton onClick={() => handleShow2()}><MoreVertIcon fontSize='small' /></IconButton>
                        </div>
                    </div>
                </div>
            </Grid>
        </>

    )
}
