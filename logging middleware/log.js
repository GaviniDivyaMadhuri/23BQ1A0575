console.log("script started");
const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJnYXZpbmltYWRodXJpMTNAZ21haWwuY29tIiwiZXhwIjoxNzgwNjQwOTI4LCJpYXQiOjE3ODA2NDAwMjgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI4ZjU1YTIzOS0yZDMwLTQ4NWQtYTFlOS02YzdlZjA2YTllYWMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJnYXZpbmkgZGl2eWEgbWFkaHVyaSIsInN1YiI6ImYyZjMyMDIyLWQ1YWYtNGJhYS04YTc1LWI5YWNhZWE0MzlmOSJ9LCJlbWFpbCI6ImdhdmluaW1hZGh1cmkxM0BnbWFpbC5jb20iLCJuYW1lIjoiZ2F2aW5pIGRpdnlhIG1hZGh1cmkiLCJyb2xsTm8iOiIyM2JxMWEwNTc1IiwiYWNjZXNzQ29kZSI6IlFRZEVZeSIsImNsaWVudElEIjoiZjJmMzIwMjItZDVhZi00YmFhLThhNzUtYjlhY2FlYTQzOWY5IiwiY2xpZW50U2VjcmV0IjoialVkbWpiQmhyc2pNSnhXZCJ9.IRpU9xipbeqhAhZe2ZpFNmaPuVGXjHcqNkn44MbyFDI";
console.log("logging middleware started");
fetch("http://4.224.186.213/evaluation-service/logs",{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer "+token
    },
    body:JSON.stringify({
        stack:"frontend",
        level:"error",
        package:"api",
        message:"received string,expected bool"
    })
})
.then(res=>res.json())
.then(data=>{
    console.log("Response:");
    console.log(data);
})
.catch(err=>{
    console.log("Error:",err);
});