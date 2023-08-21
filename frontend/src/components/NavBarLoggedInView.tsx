
import {Button, Navbar} from "react-bootstrap"

import * as NoteApi from "../network/notes_api"
import {User} from "../models/user"

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful : () => void,
}

const NavBarLoggedInView = ({user ,onLogoutSuccessful}: NavBarLoggedInViewProps) =>{

    async function logout() {
        try {
            await NoteApi.logout();
            onLogoutSuccessful();
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    return (
        <>
            <Navbar.Text className="me-2">
                Signed in as : {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Logout</Button>
        </>
    );
}

export default NavBarLoggedInView