export default function InputLabel({
    label,
    setFormData,
    formDataProp,
    formData,
    type="text"
}) {
    return (
        <>
            <label htmlFor={label}>{label}</label>
            <input 
                id={label}
                value={formData[formDataProp ? formDataProp : label]}
                onChange={(e) => {
                    const dupFormData = {...formData}
                    dupFormData[`${formDataProp ? formDataProp : label}`] = e.target.value
                    setFormData(dupFormData)
                }}
                type={type}
            ></input>
        </>
    )
}