import React, { useState } from 'react'
import Navbar from './navbar'

export const CustomerLogin = () => {
    const [show,setShow]=useState(true)
  return (
    <div>
    <Navbar/>
    <section className="bg-[#EDFEFF]">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
        <div>
            <button onClick={()=>setShow(true)}>By customer ID</button>
            <button onClick={()=>setShow(false)}>By tracking number</button>
        </div>
            {/*Login by customer ID form*/}
            {
                show?<div className="p-6 space-y-4 md:space-y-6 sm:p-8 h-96">
                <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl ">
                    Check My Orders
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                    <input
                        type="text"
                        name="customerID"
                        id="customerId"
                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Customer ID"
                        required
                    />
                    </div>
                    <div>
                        <input type="password" name="password" id="password" placeholder="Passcode"
                        className=" border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required/>
                    </div>
                    <div className="flex ">
                        <a href="#" className="text-[#1E90FF] text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full bg-[#1E90FF] text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Check my orders</button>
                </form>
            </div>:null
            }

            {/*Login by tracking number form*/}
            {
                show?null:<div className="p-6 space-y-4 md:space-y-6 sm:p-8 h-96">
                <h1 className="text-xl font-bold leading-tight tracking-tight  md:text-2xl ">
                    Check My Orders
                </h1>
                <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                    <input
                        type="text"
                        name="trNumber"
                        id="trNumber"
                        className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tracking number"
                        required
                    />
                    </div>
                    <div className="flex ">
                        <a href="#" className="text-[#1E90FF] text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot tracking number?</a>
                    </div>
                    <button type="submit" className="w-full bg-[#1E90FF] text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Check my order</button>
                </form>
            </div>
            }
            
        </div>
    </div>
    </section>
</div>
    
  )
}
