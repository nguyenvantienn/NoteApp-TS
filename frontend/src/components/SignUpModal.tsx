
import {useState} from "react"
import {useForm} from "react-hook-form";

import { User } from "../models/user";
import {SignUpCredentials} from "../network/notes_api"
import * as NoteApi from "../network/notes_api"
import { Modal ,Form ,Button, Alert} from "react-bootstrap";
import TextInputField from "./form/TextInputField"
import UltiStyle from "../styles/ultis.module.css"
import { ConflictError } from "../errors/http_errors";


interface SignUpMNodalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user:User) => void,
}

const SignUpModal =({onDismiss , onSignUpSuccessful} : SignUpMNodalProps) =>{
    const { register , handleSubmit , formState: { errors ,isSubmitting }} = useForm<SignUpCredentials>();

    const [errorText , setErrorText] = useState<string | null>(null);

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            console.log("User :" ,credentials);
            const newUser = await NoteApi.signUp(credentials);
            console.log("User :" ,newUser);
            onSignUpSuccessful(newUser)
        } catch (error) {
            if (error instanceof ConflictError) {
                setErrorText(error.message);
            }else{
                alert(error);
            }   
            console.error(error);
        }
    }

    return(
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {errorText &&
                    <Alert variant="danger">{errorText}</Alert>
                }

                <Form id="signUp" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder = "Enter UserName"
                        register={register}
                        registerOptions={{ required:"Required" }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="email"
                        label="email"
                        type="text"
                        placeholder = "Please enter your email"
                        register={register}
                        registerOptions={{ required:"Required" }}
                        error={errors.email}
                    />

                    <TextInputField
                        name="password"
                        label="password"
                        type="password"
                        placeholder = "Please enter your password"
                        register={register}
                        registerOptions={{ required:"Required" }}
                        error={errors.password}
                    />
                </Form>

                <Button
                    type="submit"
                    form="signUp"
                    disabled={isSubmitting}
                    className={UltiStyle.width100}
                >
                    Sign Up
                </Button>
            </Modal.Body>
        </Modal>
    )
}

export default SignUpModal;