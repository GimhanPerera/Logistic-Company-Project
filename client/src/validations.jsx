import * as Yup from 'yup';

const descriptionValidation = Yup.string()
    .test('is-valid-description', 'Description cannot be only numbers or special characters', (value) => {
        if (!value) return true; // Allow blank value
        return /[a-zA-Z]/.test(value); // Check for at least one alphabetic character
    })
    .min(3, 'Description must be at least 3 characters long');


export const testValication = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter name"),
    l_name: Yup.string().min(3).required("Please Enter name"),
    tel_number: Yup.string().min(3).required("Please Enter name"),
})

export const staffLoginValidation = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
        .required('Email is required'),
    password: Yup.string().required('Password is required'),
})

export const customerLoginValidation = Yup.object({
    customerID: Yup.string().required("Please Enter customer ID"),
    password: Yup.string().min(3).required("Please Enter password"),
})

export const complainValidation = Yup.object({
    complain: Yup.string().required("Please Enter customer ID"),
})

export const addCustomerValidation = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter first name"),
    l_name: Yup.string().min(3).required("Please Enter last name"),
    tel_number: Yup.string().min(3).required("Please Enter Telephone number"),
    address: Yup.string().min(3).required("Please Enter Address"),
    nic: Yup.string().min(3).required("Please Enter NIC"),
})

export const shipmentDetailsValidation = Yup.object({
    BLnumber: Yup.string().min(3).required("Please Enter first name"),
    shippingMethod: Yup.string().min(3).required("Please Enter first name"),
    loadedDate: Yup.string().min(3).required("Please Enter first name"),
    arrivalDate: Yup.string().min(3).required("Please Enter first name"),
    displayDate: Yup.string().min(3).required("Please Enter first name"),
})

export const priceQuotationValidation = Yup.object({
    items: Yup.string()
        .required("Please enter items")
        .min(3, "Must be at least 3 characters")
        .max(40, "Must not exceed 40 characters"),
    packages: Yup.number()
        .required("Please enter package count")
        .typeError("Packages must be a number")
        .integer("Packages must be an integer")
        .max(100, "Must not exceed 100"),
    weight: Yup.string().required("Please enter weight"),
    shippingmethod: Yup.string().required("Please Enter shippingmethod"),
    quotation: Yup.string().min(3).required("Please Enter quotation"),
    description: descriptionValidation
});
export const priceQuotationByCustomerValidation = Yup.object({
    items: Yup.string()
        .required("Please enter items")
        .min(3, "Must be at least 3 characters")
        .max(40, "Must not exceed 40 characters"),
    packages: Yup.number()
        .required("Please enter package count")
        .typeError("Packages must be a number")
        .integer("Packages must be an integer")
        .max(100, "Must not exceed 100"),
    weight: Yup.string().required("Please enter weight"),
    shippingmethod: Yup.string().required("Please Enter shippingmethod"),
})
export const addPackageValidation = Yup.object({
    package_count: Yup.string().min(1).required("Please Enter name"),
    items: Yup.string().min(2).required("Please Enter name"),
    length: Yup.string().min(2).required("Please Enter name"),
    height: Yup.string().min(2).required("Please Enter name"),
    width: Yup.string().min(2).required("Please Enter name"),
    weight: Yup.string().min(2).required("Please Enter name"),
    volume_metric_weight: Yup.string().min(1).required("Please Enter name"),
    gross_weight: Yup.string().min(1).required("Please Enter name"),
})

export const scanPackagesValidation = Yup.object({
    shippingMark: Yup.string().required("Shipping Mark cannot be empty"),
    count: Yup.string().required("Count cannot be empty"),
    collectedCount: Yup.string().required("Collected Count cannot be empty"),
});

export const addSupplier = Yup.object({
    name: Yup.string().min(3).required("Please Enter name"),
    country: Yup.string().min(3).required("Please Enter name"),
    tp: Yup.string().min(3).required("Please Enter name"),
    description: Yup.string().min(3).required("Please Enter name"),
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