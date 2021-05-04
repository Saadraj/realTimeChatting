import {
    Box,
    Button,
    Container,
    createStyles,
    Divider,
    FormControl,
    FormHelperText,
    makeStyles,
    Paper,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import firebase from "firebase";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { auth, fireStore } from "../Firebase";
import { signUpValidationSchema } from "../validator/Singnup";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& .MuiTextField-root": {
                margin: theme.spacing(1),
                width: "25ch",
            },
        },
        error: {
            color: "tomato",
            paddingLeft: theme.spacing(1),
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
                textDecoration: "underline",
            },
        },
    })
);

const initialValues = {
    name: "",
    email: "",
    confirmPassword: "",
    password: "",
};

const signup = () => {
    const classes = useStyles();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const submitSignUp = async (values: {
        name: string;
        email: string;
        confirmPassword: string;
        password: string;
    }) => {
        try {
            const validateData = await signUpValidationSchema.validate(values);
            auth.createUserWithEmailAndPassword(
                validateData.email,
                validateData.password
            )
                .then((res) => {
                    fireStore
                        .collection("users")
                        .doc(res.user.uid)
                        .set({
                            name: values.name,
                            email: res.user.email,
                            uid: res.user.uid,
                            unread:[],
                            friends: [],
                            online:true,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                            router.push("/");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((err) => setErrorMessage(err.message));
        } catch (error) {
            setErrorMessage("Please Fill the Fields Correctly");
        }
    };

    return (
        <Box
            style={{
                backgroundColor: "GrayText",
                height: "100vh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={1}
                    style={{
                        padding: "20px",
                        overflow: "auto",
                    }}
                >
                    <Typography
                        variant="h3"
                        align="center"
                        color="secondary"
                        gutterBottom
                    >
                        SignUp
                    </Typography>
                    <Divider variant="middle" />
                    <Formik
                        initialValues={initialValues}
                        validationSchema={signUpValidationSchema}
                        onSubmit={(value) => submitSignUp(value)}
                    >
                        {({ isSubmitting, isValidating }) => (
                            <Form>
                                {errorMessage && (
                                    <Alert
                                        severity="error"
                                        onClose={() => {
                                            setErrorMessage("");
                                        }}
                                    >
                                        {errorMessage}
                                    </Alert>
                                )}
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="name"
                                        label="Name"
                                        placeholder="Name"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="name">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="email"
                                        label="Email"
                                        placeholder="Email"
                                        variant="outlined"
                                    />
                                    <ErrorMessage name="email">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="password"
                                        label="Password"
                                        placeholder="Password"
                                        variant="outlined"
                                        type="password"
                                    />
                                    <ErrorMessage name="password">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Field
                                        as={TextField}
                                        name="confirmPassword"
                                        label="Confirm Password"
                                        placeholder="Confirm Password"
                                        variant="outlined"
                                        type="password"
                                    />
                                    <ErrorMessage name="confirmPassword">
                                        {(msg) => (
                                            <FormHelperText
                                                className={classes.error}
                                            >
                                                {msg}
                                            </FormHelperText>
                                        )}
                                    </ErrorMessage>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting || isValidating}
                                    >
                                        Sign Up
                                    </Button>
                                </FormControl>
                            </Form>
                        )}
                    </Formik>
                    <Typography align="center" gutterBottom>
                        Already Have an Account?{" "}
                        <Link href="/login">
                            <a className={classes.link}>Login</a>
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default signup;
