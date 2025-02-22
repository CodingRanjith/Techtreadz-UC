// Attach the event listener to the job posting form (make sure to add id="jobPostingForm" to your form tag)
document.querySelector("#jobPostingForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather form field values
    let email = document.querySelector("input[name='email']").value.trim();
    let username = document.querySelector("input[name='username']").value.trim();
    let jobTitle = document.querySelector("input[name='job_title']").value.trim();
    let jobType = document.querySelector("select[name='job_type']").value;
    let jobCategory = document.querySelector("select[name='job_category']").value;
    let applicationEmail = document.querySelector("input[name='application_email']").value.trim();
    let companyName = document.querySelector("input[name='company_name']").value.trim();

    // Optional fields
    let location = document.querySelector("input[name='location']").value.trim();
    let jobTags = document.querySelector("input[name='job_tags']").value.trim();
    let description = document.querySelector("textarea[name='description']").value.trim();
    let closingDate = document.querySelector("input[name='closing_date']").value;
    let companyWebsite = document.querySelector("input[name='company_website']").value.trim();
    let companyTagline = document.querySelector("input[name='company_tagline']").value.trim();
    let twitterUsername = document.querySelector("input[name='twitter_username']").value.trim();

    // Validate required fields
    if (!email || !username || !jobTitle || !jobType || !jobCategory || !applicationEmail || !companyName) {
        Swal.fire({
            icon: "error",
            title: "Missing Information",
            text: "Please fill in all required fields."
        });
        return;
    }

    // Show a loading message
    Swal.fire({
        title: "Submitting Job Posting...",
        text: "Please wait while we process your submission.",
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    // Prepare the parameters for emailjs
    let templateParams = {
        email: email,
        username: username,
        job_title: jobTitle,
        location: location,
        job_type: jobType,
        job_tags: jobTags,
        job_category: jobCategory,
        description: description,
        closing_date: closingDate,
        application_email: applicationEmail,
        company_name: companyName,
        company_website: companyWebsite,
        company_tagline: companyTagline,
        twitter_username: twitterUsername
    };

    try {
        // Send the email using EmailJS
        await emailjs.send("service_4t6c30o", "template_cuzwsdq", templateParams);

        // Show success message for 5 seconds, then reset the form
        Swal.fire({
            icon: "success",
            title: "Job Posted!",
            text: "Thank you! The Techtrendz team will contact you shortly.",
            confirmButtonColor: "#28a745",
            timer: 5000,
            showConfirmButton: false
        }).then(() => {
            document.querySelector("#jobPostingForm").reset();
        });
    } catch (error) {
        // If there's an error, show an error alert
        Swal.fire({
            icon: "error",
            title: "Submission Failed",
            text: "Could not submit your job posting. Please try again later."
        });
    }
});