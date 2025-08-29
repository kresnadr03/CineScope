import { Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext.jsx";

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const checked = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className="d-flex align-items-center ms-lg-3"
      title={`Switch to ${checked ? "light" : "dark"} mode`}
    >
      <Form.Check
        type="switch"
        id="theme-switch"
        checked={checked}
        onChange={toggleTheme}
        label={checked ? "Dark" : "Light"}
      />
    </motion.div>
  );
}
