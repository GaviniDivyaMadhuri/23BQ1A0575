console.log("file is running");

fetch("http://4.224.186.213/evaluation-service/register", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "gavinimadhuri13@gmail.com",
        name: "Gavini Divya Madhuri",
        mobileNo: "7981669592",
        githubUsername: "GaviniDivyaMadhuri",
        rollNo: "23BQ1A0575",
        accessCode: "QQdEYy"
    })
})
.then(res => {
    console.log("Status:", res.status);
    return res.json();
})
.then(data => {
    console.log("Response received");
    console.log(data);
})
.catch(err => {
    console.error("Error occurred", err);
});