export default function Autheader() {
    const userRole = localStorage.getItem("user");

    if (userRole) {
        const parsedUserRole = JSON.parse(userRole); // Parse the string into an object

        if (parsedUserRole && parsedUserRole.accessToken) {
            return { "x-auth-token": parsedUserRole.accessToken };
        }
    }
    
    return {};
}


//import authHeader from "./../services/auth-header"
//axios.get(API_URL, {headers: authHeader()}); //authHeader hs the accessToken