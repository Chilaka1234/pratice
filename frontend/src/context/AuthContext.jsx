import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const login = (userData, jwt)=>{

        setUser(userData);

        setToken(jwt);

        localStorage.setItem("user",JSON.stringify(userData));

        localStorage.setItem("token",jwt);

    };

    const logout=()=>{

        setUser(null);

        setToken(null);

        localStorage.removeItem("user");

        localStorage.removeItem("token");

    };

    return(

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    )

};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);