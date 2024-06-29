import React, { useEffect, useState } from 'react'
import './style.css'
import SingleBook from '../../Components/SingleBook/SingleBook'
import { Grid } from '@mui/material'
import { auth, database } from '../../firebase'

export default function Library() {
    const [books, setBooks] = useState([])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books`).on('value', snapshot => {
            let arr = []
            snapshot.forEach((snap) => {
                arr.push(snap.val())
            })
            setBooks(arr)
        })
    }, [auth?.currentUser?.uid])

    return (
        <>
            <div className='page_head'>
                <div className='page_name'>Library</div>
                <hr className='hr' />
            </div>
            <div className='library'>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 24 }}>
                    {books?.map((book) => {
                        return <SingleBook bookName={book.bookName} bookURL={book.bookURL} id={book.id} />
                    })}
                </Grid>
            </div>
        </>
    )
}
