import React from "react";
import { Typography, Paper } from "@material-ui/core";

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = () => {
    // Password strength logic based on requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 5;
    const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/.test(
      password
    );

    // Update the conditions for a strong password
    if (isStrongPassword) {
      return "Strong";
    } else if (
      (hasUpperCase && hasLowerCase && hasNumber) ||
      (hasUpperCase && hasLowerCase && hasSpecialChar) ||
      (hasUpperCase && hasNumber && hasSpecialChar) ||
      (hasLowerCase && hasNumber && hasSpecialChar)
    ) {
      return "Moderate";
    } else {
      return "Weak";
    }
  };

  const getPasswordColor = () => {
    const strength = getStrength();
    switch (strength) {
      case "Strong":
        return "#4CAF50"; // Green
      case "Moderate":
        return "#FFC107"; // Yellow
      case "Weak":
        return "#FF5722"; // Red
      default:
        return "";
    }
  };

  return (
    <Paper
      className="mb-4"
      style={{
        backgroundColor: getPasswordColor(),
        padding: "8px",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: "8px",
      }}
    >
      <Typography variant="body1" style={{ color: "white" }}>
        {getStrength()}
      </Typography>
    </Paper>
  );
};

export default PasswordStrengthIndicator;
