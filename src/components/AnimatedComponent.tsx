import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export interface IAnimatedComponentProps {
  children: any;
  triggerOnce?: boolean;
  threshold?: number;
}

const AnimatedComponent = ({ children, triggerOnce, threshold }: IAnimatedComponentProps) => {
  const { ref, inView } = useInView({
    triggerOnce: triggerOnce ?? true, // Only trigger the animation once
    threshold: threshold ?? 0.6, // Trigger when 10% of the component is visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      style={{
        alignSelf: "center",
        width: "100%",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedComponent;
