export default {
    host:process.env.NODE_ENV === "production"?window.location.origin:"http://localhost:3000" ,
    socket: "/socket",
    mock:true
  };
