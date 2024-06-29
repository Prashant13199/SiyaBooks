import React, { useEffect, useState } from 'react'
import './style.css'
import { auth, database } from '../../firebase'
import SingleBook from '../../Components/SingleBook/SingleBook'
import { Grid } from '@mui/material'

export default function Home() {

    const [reading, setReading] = useState([])
    const [newBook, setNewBook] = useState([])

    useEffect(() => {
        database.ref(`/Users/${auth?.currentUser?.uid}/Books`).on('value', snapshot => {
            let arr = []
            let arr2 = []
            snapshot.forEach((snap) => {
                if (snap.val()?.percentage > 0 && snap.val()?.percentage < 100) {
                    arr.push(snap.val())
                } else {
                    if (snap.val()?.percentage !== 100) {
                        arr2.push(snap.val())
                    }
                }
            })
            setReading(arr)
            setNewBook(arr2)
        })
    }, [auth?.currentUser?.uid])

    return (
        <div>
            <div className='page_head'>
                <div className='page_name'>Home</div>
                <hr className='hr' />
            </div>
            {reading?.length !== 0 && <>
                <div className='sub_heading'>Continue Reading</div>
                <div className='library'>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 6, md: 24 }}>
                        {reading?.map((book) => {
                            return <SingleBook bookName={book.bookName} bookURL={book.bookURL} id={book.id} />
                        })}
                    </Grid>
                </div>
            </>}
            {newBook?.length !== 0 && <>
                <div className='sub_heading'>More to explore</div>
                <div className='library'>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 12, md: 24 }}>
                        {newBook?.map((book) => {
                            return <SingleBook bookName={book.bookName} bookURL={book.bookURL} id={book.id} />
                        })}
                    </Grid>
                </div>
            </>}
        </div>
    )
}
