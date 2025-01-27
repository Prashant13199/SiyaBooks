import React, { useState } from "react";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "../../firebase";
import TextField from "@mui/material/TextField";
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function ForgotPassword({ handleClose2 }) {

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState('')
    const [show2, setShow2] = useState(false);

    const forgot = async () => {
        setLoading(true);
        await auth.sendPasswordResetEmail(email)
            .then((user) => {
                setLoading(false);
                setShow2(true)
                handleClose2()
            })
            .catch((e) => {
                setLoading(false);
                setError(e.toString())
                setShow(true)
            });
    };
    return (
        <>
            {show && <Alert variant="danger" onClose={() => {
                setShow(false)
                setError("")
            }
            } dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <div style={{ fontSize: 'small' }}>
                    {error}
                </div>
            </Alert>}
            {show2 && <Alert variant="success" onClose={() => {
                setShow2(false)
            }
            } dismissible>
                <Alert.Heading>Password reset link sent!</Alert.Heading>
                <div style={{ fontSize: 'small' }}>
                    Please check spam also
                </div>
            </Alert>}
            <div className="login__text">
                <h2>
                    Forgot Password
                </h2>
            </div>
            <div className="d-grid gap-2">
                <TextField
                    id="standard-helperText"
                    label="Email"
                    variant="standard"
                    type="email"
                    required
                    color="success"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="d-grid gap-2" style={{ marginTop: "20px" }}>
                <Button
                    variant="success"
                    size="md"
                    id="uploadBtn"
                    onClick={() => forgot()}
                >
                    {loading ? "Please Wait.." : "Send Reset Link"}
                </Button>
            </div>
        </>
    );
}