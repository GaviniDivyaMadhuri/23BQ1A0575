console.log("Authentication started");

fetch("http://4.224.186.213/evaluation-service/auth", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: "gavinimadhuri13@gmail.com",
        name: "gavini divya madhuri",
        rollNo: "23bq1a0575",
        accessCode: "QQdEYy",
        clientID: "f2f32022-d5af-4baa-8a75-b9acaea439f9",
        clientSecret: "jUdmjbBhrsjMJxWd"
    })
})
.then(res => res.json())
.then(data => {
    console.log("Authentication Response:");
    console.log(data);
})
.catch(err => {
    console.log("Error:", err);
});