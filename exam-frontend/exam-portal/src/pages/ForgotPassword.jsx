import React, {  useState } from "react";
import API from "../services/api";
import { Card, Input, Button } from "antd";
import toast from "react-hot-toast";

function ForgotPassword() {

  const [step, setStep] = useState(1);

  const [rollNo, setRollNo] = useState("");
  const [otp, setOtp] = useState("");           // user entered OTP
  const [generatedOtp, setGeneratedOtp] = useState(""); // ✅ NEW (from backend)
  const [newPassword, setNewPassword] = useState("");

  // =============================
  // SEND OTP
  // =============================
  const sendOtp = async () => {
    try {
      const res = await API.post("/students/send-otp", { rollNo });

      setGeneratedOtp(res.data.otp); // ✅ STORE OTP FROM BACKEND

      toast.success("OTP sent ✅");
      setStep(2);

    } catch {
      toast.error("User not found ❌");
    }
  };

  // =============================
  // RESET PASSWORD
  // =============================
  const resetPassword = async () => {
    try {
      await API.post("/students/verify-otp", {
        rollNo,
        otp,
        newPassword
      });

      toast.success("Password updated 🎉");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data || "Error ❌");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

      <Card style={{ width: 350, borderRadius: 15 }}>

        <h2>🔐 Reset Password</h2>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <Input
              placeholder="Enter Roll No"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />

            <br /><br />

            <Button type="primary" block onClick={sendOtp}>
              Send OTP
            </Button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            {/* ✅ SHOW OTP (DEMO PURPOSE) */}
            {generatedOtp && (
              <div style={{
                backgroundColor: "#fff3cd",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "10px"
              }}>
                <b>Your OTP:</b> {generatedOtp}

                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                  ⚠️ Demo Mode: OTP is shown here for demonstration.
                  In real systems, it is sent securely via email/SMS.
                </p>
              </div>
            )}

            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <br /><br />

            <Input.Password
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <br /><br />

            <Button type="primary" block onClick={resetPassword}>
              Update Password
            </Button>
          </>
        )}

      </Card>
    </div>
  );
}

export default ForgotPassword;