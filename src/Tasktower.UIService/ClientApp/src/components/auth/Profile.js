import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently, getIdTokenClaims } = useAuth0();

    if (isLoading) {
        return <div>Loading ...</div>;
    }
    if (!isAuthenticated) {
        return (<div>401 unauthorized</div>)
    }
    getAccessTokenSilently({ ignoreCache: true, scope: "openid email profile" })
        .then(console.log).catch(console.error);
    getIdTokenClaims({ ignoreCache: true, scope: "openid email profile" })
        .then(x => console.log(x.__raw)).catch(console.error);
    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <p>{JSON.stringify(user)}</p>
            </div>
        )
    );
};

export default Profile;