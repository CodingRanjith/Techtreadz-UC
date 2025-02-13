  

  document.querySelector("#resumeForm").addEventListener("submit", async function(event) {
      event.preventDefault(); // Prevent default form submission

      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let phone = document.getElementById("phone").value;
      let resume = document.getElementById("resume").files[0];

      if (!name || !email || !phone || !resume) {
          Swal.fire({ icon: "error", title: "Missing Information", text: "Please fill in all fields and upload a resume." });
          return;
      }

      Swal.fire({ title: "Uploading Resume...", text: "Please wait while we upload your resume.", allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

      let formData = new FormData();
formData.append("file", resume);
formData.append("upload_preset", "techtrendz"); // Replace with your Cloudinary Upload Preset
formData.append("resource_type", "raw"); // This ensures PDFs, docs, and other files are correctly uploaded
      
      try {
          let response = await fetch("https://api.cloudinary.com/v1_1/di5pgdwkg/upload", {
              method: "POST",
              body: formData
          });

          let result = await response.json();

          if (!result.secure_url) {
              throw new Error("File upload failed");
          }

          // Ensure the Cloudinary URL is correct
let resumeURL = result.secure_url.trim(); // Trim to remove any spaces

// // Log to check the resume URL before sending the email
// console.log("Resume Link:", resumeURL);

// Send email to Admin ONLY
emailjs.send("service_bkh3y08", "template_ag5reeg", {
    to_email: "admin@techtrendz.com",
    name: name,
    email: email,
    phone: phone,
    resume_link: encodeURI(resumeURL) // Encode the URL to prevent breaking
}).then(response => {
    console.log("Admin email sent successfully!", response);
}).catch(error => {
    console.error("Error sending admin email:", error);
    Swal.fire({ icon: "error", title: "Admin Email Failed", text: "The submission was successful, but the admin did not receive an email." });
});


          // Save to Google Sheets
          fetch("https://script.google.com/macros/s/AKfycbyf0n_ylAEnF3SgZrmPI4G8XmiUdwFHqi_BcrwiS600o1glo-ElLKJlyliNFwsrsRRw3A/exec", { // Replace with your Google Sheets API URL
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  name: name,
                  email: email,
                  phone: phone,
                  resume_link: resumeURL
              })
          }).then(response => response.text()).then(data => {
              if (data === "Success") {
                  Swal.fire({
                      icon: "success",
                      title: "Resume Submitted",
                      text: "Your resume has been submitted successfully!",
                      confirmButtonColor: "#28a745",
                  }).then(() => {
                      document.querySelector("#resumeForm").reset();
                      document.getElementById("resumeModal").querySelector(".btn-close").click();
                  });
              } else {
                  throw new Error("Failed to save data");
              }
          }).catch(error => {
              Swal.fire({ icon: "error", title: "Data Save Failed", text: "Your submission was successful, but we couldn't save your details." });
          });

      } catch (error) {
          Swal.fire({ icon: "error", title: "Upload Failed", text: "Could not upload the resume. Please try again later." });
      }
  });

  