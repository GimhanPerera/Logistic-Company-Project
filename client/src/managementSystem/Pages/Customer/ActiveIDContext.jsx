import React, { createContext, useState } from 'react';

export const ActiveIDContext = createContext();

export const ActiveIDProvider = ({ children }) => {
    const [activeIDlist, setActiveIDlist] = useState([]);

    return (
        <ActiveIDContext.Provider value={{ activeIDlist, setActiveIDlist }}>
            {children}
        </ActiveIDContext.Provider>
    );
};
