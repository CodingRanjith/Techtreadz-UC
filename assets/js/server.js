document.querySelector("#resumeForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let resume = document.getElementById("resume").files[0];

    if (!name || !email || !phone || !resume) {
        Swal.fire({
            icon: "error",
            title: "Missing Information",
            text: "Please fill in all fields and upload a resume."
        });
        return;
    }

    Swal.fire({
        title: "Uploading Resume...",
        text: "Please wait while we upload your resume.",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    let formData = new FormData();
    formData.append("file", resume);
    formData.append("upload_preset", "techtrendz"); // Replace with your Cloudinary Upload Preset
    formData.append("resource_type", "raw"); // Ensures PDFs, docs, and other files are correctly uploaded

    try {
        let response = await fetch("https://api.cloudinary.com/v1_1/di5pgdwkg/upload", {
            method: "POST",
            body: formData
        });

        let result = await response.json();

        if (!result.secure_url) {
            throw new Error("File upload failed");
        }

        let resumeURL = result.secure_url.trim(); // Trim to remove any spaces

        // Send email to Admin ONLY
        await emailjs.send("service_4t6c30o", "template_r4cddkd", {
            to_email: "infotech-trendz.be",
            name: name,
            email: email,
            phone: phone,
            resume_link: encodeURI(resumeURL) // Encode the URL to prevent breaking
        });

        // Show success message for 5 seconds, then close modal
        Swal.fire({
            icon: "success",
            title: "Resume Submitted!",
            text: "Your resume has been submitted successfully. We will contact you shortly.",
            confirmButtonColor: "#28a745",
            timer: 5000, // Shows for 5 seconds
            showConfirmButton: false
        }).then(() => {
            document.querySelector("#resumeForm").reset();
            document.getElementById("resumeModal").querySelector(".btn-close").click();
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: "Could not upload the resume. Please try again later."
        });
    }
});
