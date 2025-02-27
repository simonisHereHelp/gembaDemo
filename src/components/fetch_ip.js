const fetchIP = async () => {
    try {
      const response = await fetch("https://nano-web-713b1-default-rtdb.firebaseio.com/jetson_ip.json");
      const ip = await response.json();
  
      // ✅ Ensure it's a properly formatted string without extra quotes
      return typeof ip === "string" ? ip.replace(/['"]+/g, '') : "localhost";
    } catch (error) {
      console.error("Error fetching IP:", error);
      return "localhost";
    }
  };
  
  export default fetchIP;
  