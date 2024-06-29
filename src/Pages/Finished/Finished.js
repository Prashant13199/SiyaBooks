import React, { useEffect, useState } from 'react'
import './style.css'
import { auth, database } from '../../firebase'
import SingleBook from '../../Components/SingleBook/SingleBook'
import { Grid } from '@mui/material'

export default function Finished() {

    const [books, setBooks] = useState([])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books`).on('value', snapshot => {
            let arr = []
            snapshot.forEach((snap) => {
                if (snap.val().percentage === 100) {
                    arr.push(snap.val())
                }
            })
            setBooks(arr)
        })
    }, [auth?.currentUser?.uid])

    return (
        <div>
            <div className='page_head'>
                <div className='page_name'>Books you finished</div>
                <hr className='hr' />
            </div>
            <div className='library'>
                <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 24 }}>
                    {books?.map((book) => {
                        return <SingleBook bookName={book.bookName} bookURL={book.bookURL} id={book.id} />
                    })}
                </Grid>
            </div>
        </div>
    )
}
