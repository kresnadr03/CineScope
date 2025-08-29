import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Tilt({ children, max = 10, className = "" }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rX = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 18 });
  const rY = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div className={className} style={{ perspective: 900 }} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <motion.div style={{ rotateX: rX, rotateY: rY, willChange: "transform" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
