import * as Yup from 'yup';

//Description validation: des is optional
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

export const customerDetailsValidation = Yup.object({
    f_name: Yup.string()
        .required("First name required")
        .min(3, "First name must be at least 3 characters long")
        .max(15, "First name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    l_name: Yup.string()
        .required("Last name required")
        .min(3, "Last name must be at least 3 characters long")
        .max(15, "Last name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    nic: Yup.string()
        .required("NIC required")
        .max(20, "Last name must be at most 20 characters long")
        .matches(/^\d{9}[Vv]$|^\d{12}$/, "Enter valid NIC"),//Sri Lankan NIC format (e.g., 123456789V or 123456789012)
    tel_number: Yup.string()
        .required("Telephone number required")
        .matches(/^(\d{9}|0\d{9})$/, "Please enter valid telephone number"), //9-digit or a 10-digit starting with 0
    address: Yup.string()
        .required("Address required")
        .min(5, "Please enter valid address")
        .max(50, "address must be at most 50 characters long"),
})

//Staff login validation: StaffLogin.jsx
export const staffLoginValidation = Yup.object({
    email: Yup.string()
        .email('Invalid email format')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
})

//For customer Login: custimerLogin.jsx
export const customerLoginValidation = Yup.object({
    customerID: Yup.string().required("Please Enter customer ID"),
    password: Yup.string().min(3).required("Please Enter password"),
})

//For complain model: complainModal.jsx
export const complainValidation = Yup.object({
    complain: Yup.string().required("Please Enter your complain")
        .min(5, "Complaint must be at least 5 characters long")
        .max(254, "Complaint must be at most 254 characters long"),
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

//----------------------------------------------------------------------
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
    quotation: Yup.number()
        .required("Please enter the quotation")
        .min(0, "Please enter valid quotation")
        .max(999999.99, "Must not exceed 999999.99"),
    description: descriptionValidation
});

//Price quotation: newOrderRequest.jsx
export const priceQuotationByCustomerValidation = Yup.object({
    items: Yup.string()
        .required("Please enter items")
        .min(3, "Must be at least 3 characters")
        .max(40, "Must not exceed 40 characters"),
    packages: Yup.number()
        .required("Please enter package count")
        .typeError("Packages must be a number")
        .integer("Packages must be an integer")
        .min(1, "Please enter valid count")
        .max(100, "Must not exceed 100"),
    description: Yup.string()
        .max(100, "Must not exceed 100"),
    weight: Yup.number()
        .required("Please enter weight")
        .typeError("Please enter valid weight")
        .min(0, "Please enter valid weight")
        .max(100, "weight must not exceed 100KG"),
    shippingmethod: Yup.string().required("Please Enter Shipping method"),
})

export const addPackageValidation = Yup.object({
    package_count: Yup.string().min(1).required("Please Enter name"),
    items: Yup.string().min(2).required("Please Enter name"),
    length: Yup.string().min(2).required("Please Enter name"),
    height: Yup.string().min(2).required("Please Enter name"),
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

//employee details: editEmployee.jsx
export const employeeFormValidation = Yup.object({
    f_name: Yup.string()
        .required("First name required")
        .min(3, "First name must be at least 3 characters long")
        .max(15, "First name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    l_name: Yup.string()
        .required("Last name required")
        .min(3, "Last name must be at least 3 characters long")
        .max(15, "Last name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    nic: Yup.string()
        .required("NIC required")
        .max(20, "Last name must be at most 20 characters long")
        .matches(/^\d{9}[Vv]$|^\d{12}$/, "Enter valid NIC"),//Sri Lankan NIC format (e.g., 123456789V or 123456789012)
    tel_number: Yup.string()
        .required("Telephone number required")
        .matches(/^(\d{9}|0\d{9})$/, "Please enter valid telephone number"), //9-digit or a 10-digit starting with 0
    email: Yup.string()
        .email("Invalid email address")
        .required("Please enter email"),
})

//Courier details add/edit: addEditCourierModal.jsx
export const courierFormValidation = Yup.object({
    nameField: Yup.string()
    .required('Name is required')
    .max(30, "Name is too long"),
    tpFields: Yup.string()
    .required("Telephone number required")
    .matches(/^(\d{9}|0\d{9})$/, "Please enter valid telephone number"), //9-digit or a 10-digit starting with 0
});

//Special Notices: addSpecialNotices.jsx
export const specialNoticeValidation = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(30, 'Title must be at most 30 characters long'),
    description: Yup.string()
        .required('Description is required')
        .min(5, "Enter valid description")
        .max(200, 'Description must be at most 200 characters long'),
    expireDate: Yup.date()
        .required('Expiration date is required')
        .min(new Date(), 'Expiration date must be in the future'),
});