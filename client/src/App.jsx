import { useState } from "react";
import "./App.css";

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  // Handle file selection
  const handleFileUpload = (event, setFile) => {
    setFile(event.target.files[0]); // Store the selected file
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file1 || !file2) {
      alert("Please select both CSV files before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      // **Step 1: Upload Files & Receive CSV**
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process CSV");

      // **Step 2: Convert Response to Blob & Trigger Download**
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "finalData.csv"; // Set filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
        backgroundColor: "#f3f4f6",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        margin: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "16px",
          color: "black",
        }}
      >
        Upload CSV Files
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        <label style={{ fontWeight: "500", color: "black",}}>Master Data</label>
        {/* File Input 1 */}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e, setFile1)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        />

        {/* File Input 2 */}
        <label style={{ fontWeight: "500",color: "black", }}>Scanned Data</label>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleFileUpload(e, setFile2)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          Upload Files
        </button>
      </form>
    </div>
  );
}

export default App;
