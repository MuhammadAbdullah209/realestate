import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const Private_route = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    console.log(currentUser);
    

    return (
        <>
            {currentUser ? <Outlet /> : <Navigate to='/SignIn' />}
        </>
    );
};

export default Private_route;
