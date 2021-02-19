import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }
    if (!isAuthenticated) {
        return (<div>401 unauthorized</div>)
    }
    getIdTokenClaims().then(x => {
        console.log(user);
        console.log(x?.__raw);
    }).catch(console.error);
    const roles: Array<string> = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || [];
    const rolesList: Array<JSX.Element> = ((roles == undefined)?[]:roles).map(r => (<li>{r}</li>));
    return (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p><u>Roles</u></p>
            <ol>
             { rolesList }
            </ol>
        </div> 
    );
};

export default Profile;