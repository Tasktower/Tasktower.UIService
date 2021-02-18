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
    getIdTokenClaims()
        .then(x => console.log(x.__raw)).catch(console.error);
    return (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{JSON.stringify(user)}</p>
        </div> 
    );
};

export default Profile;