import * as Yup from 'yup'

export const testValication = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter name"),
    l_name: Yup.string().min(3).required("Please Enter name"),
    tel_number: Yup.string().min(3).required("Please Enter name"),
})

export const addCustomerValidation = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter first name"),
    l_name: Yup.string().min(3).required("Please Enter last name"),
    tel_number: Yup.string().min(3).required("Please Enter Telephone number"),
    address: Yup.string().min(3).required("Please Enter Address"),
    nic: Yup.string().min(3).required("Please Enter NIC"),
})



// export const testValication = Yup.object({
//     name: Yup.string().min(3).required("Please Enter name"),
//     email: Yup.string().email("Please Enter Valid email").required("Please Enter Email"),
//     password: Yup.string().min(5).required("Please enter Password"),
//     cpassword: Yup.string().oneOf([Yup.ref("Password")], "Password not matched")
// })


// module.exports = {
//     testValication,
//     addCustomerValidation
// }