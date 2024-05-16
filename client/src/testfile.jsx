import React, { useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TestFile = () => {

    //================SIMPLE MSG======================
    const notify = () => toast.success("Wow so easy !");

    //=============================================================
    useEffect(() => {
        const myPromise = new Promise((resolve) =>
            fetch("https://jsonplaceholder.typicode.com/posts/1")
                .then((response) => response.json())
                .then((json) => setTimeout(() => resolve(json), 3000))
        );

        toast.promise(myPromise, {
            pending: "Promise is pending",
            success: "Promise  Loaded",
            error: "error",
        });
    }, []);

    return (
        <div>
            <button onClick={notify}>Notify !</button>
            <ToastContainer />
        </div>
    );
}