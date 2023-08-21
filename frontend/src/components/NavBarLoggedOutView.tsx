import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onSLoginClicked: () => void,
}

const NavBarLoggedOutView = ({onSignUpClicked ,onSLoginClicked} : NavBarLoggedOutViewProps ) => {
    return (
        <>
            <Button onClick={onSignUpClicked}>Sign Up</Button>
            <Button onClick={onSLoginClicked}>Log In</Button>
        </>
    );
}


export default NavBarLoggedOutView;