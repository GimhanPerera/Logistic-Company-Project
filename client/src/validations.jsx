import * as Yup from 'yup';

//Description validation: des is optional
const descriptionValidation = Yup.string()
    .test('is-valid-description', 'Description cannot be only numbers or special characters', (value) => {
        if (!value) return true; // Allow blank value
        return /[a-zA-Z]/.test(value); // Check for at least one alphabetic character
    })
    .min(3, 'Description must be at least 3 characters long');


export const testValication = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter name"),  //first name
    l_name: Yup.string().min(3).required("Please Enter name"),  //last name
    tel_number: Yup.string().min(3).required("Please Enter name"),  //Telephone number
})

export const customerDetailsValidation = Yup.object({
    f_name: Yup.string()  //first name
        .required("First name required")
        .min(3, "First name must be at least 3 characters long")
        .max(15, "First name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    l_name: Yup.string()    //last name
        .required("Last name required")
        .min(3, "Last name must be at least 3 characters long")
        .max(15, "Last name must be at most 15 characters long")
        .matches(/^[A-Za-z']+$/, "Enter valid name"),
    nic: Yup.string()   //NIC number
        .required("NIC required")
        .max(20, "Last name must be at most 20 characters long")
        .matches(/^\d{9}[Vv]$|^\d{12}$/, "Enter valid NIC"),//Sri Lankan NIC format (e.g., 123456789V or 123456789012)
    tel_number: Yup.string()    //Telephone number
        .required("Telephone number required")
        .matches(/^(\d{9}|0\d{9})$/, "Please enter valid telephone number"), //9-digit or a 10-digit starting with 0
    address: Yup.string()   //address
        .required("Address required")
        .min(5, "Please enter valid address")
        .max(50, "address must be at most 50 characters long"),
})

//Staff login validation: StaffLogin.jsx
export const staffLoginValidation = Yup.object({
    email: Yup.string() //Email
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

//customer data validation
export const addCustomerValidation = Yup.object({
    f_name: Yup.string().min(3).required("Please Enter first name"),  //first name
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
        weight: Yup.number()
        .required("Please enter weight")
        .typeError("Please enter valid weight")
        .min(0.01, "Please enter valid weight")
        .max(100, "weight must not exceed 100KG"),
    shippingmethod: Yup.string().required("Please Enter shippingmethod"),
    quotation: Yup.number()
        .required("Please enter the quotation")
        .min(10, "Please enter valid quotation")
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
        .min(0.01, "Please enter valid weight")
        .max(100, "weight must not exceed 100KG"),
    shippingmethod: Yup.string().required("Please Enter Shipping method"),
})

//Validation in Add packages
export const addPackageValidation = Yup.object({
    items: Yup.string()
        .required("Please Enter items")
        .min(3, "Item must be at least 3 characters")
        .max(40, "Item must not exceed 40 characters"),
    package_count: Yup.number()
        .required("Please Enter the package count")
        .typeError("Package count must be a number")
        .min(1, "Please enter valid package count")
        .max(100, "Package count must not exceed 100")
        .integer("Invalid package count"),
    length: Yup.number()
        .required("Please Enter the length")
        .typeError("Please enter valid length")
        .min(5, "length should be more than 5cm")
        .max(1000, "length should be less than 10m"),
    width: Yup.number()
        .required("Please Enter the width")
        .typeError("Please enter valid width")
        .min(5, "width should be more than 5cm")
        .max(1000, "width should be less than 10m"),
    height: Yup.number()
        .required("Please Enter the height")
        .typeError("Please enter valid height")
        .min(5, "height should be more than 5cm")
        .max(1000, "height should be less than 10m"),
    volume_metric_weight: Yup.number()
        .required("Please Enter VMW")
        .typeError("Please enter valid VMW")
        .min(0, "VMW should be more than 0")
        .max(1000, "VMW should be less than 1000"),
    gross_weight: Yup.number()
        .required("Please Enter the gross weight")
        .typeError("Please enter valid gross weight")
        .min(0, "Please enter valid gross weight")
        .max(1000, "Gross weight should be less than 1000KG"),
})

//IN scan the package
export const scanPackagesValidation = Yup.object({
    shippingMark: Yup.string()
        .required("Shipping Mark cannot be empty"),
    count: Yup.number()
        .integer("Count must be an integer")
        .min(0, "Count cannot be negative")
        .required("Count cannot be empty"),
    collectedCount: Yup.number()
        .integer("Collected Count must be an integer")
        .min(0, "Collected Count cannot be negative")
        .max(Yup.ref('count'), "Collected Count cannot exceed Count")
        .required("Collected Count cannot be empty"),
});

//Supplyer validation
export const addSupplier = Yup.object({
    name: Yup.string().min(3).required("Please Enter name"),
    country: Yup.string().min(3).required("Please Enter name"),
    tp: Yup.string().min(3).required("Please Enter name"),
    description: Yup.string().min(3).required("Please Enter name"),
})

//employee details: editEmployee.jsx
export const employeeFormValidation = Yup.object({
    f_name: Yup.string()  //first name
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