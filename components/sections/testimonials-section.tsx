"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { testimonials } from "@/lib/data";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const TestimonialCard = ({ testimonial, index }: { 
  testimonial: typeof testimonials[0];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "min-w-[300px] md:min-w-[400px] lg:min-w-[500px]",
        "bg-card/60 backdrop-blur-sm rounded-2xl p-8",
        "border border-border/50 shadow-lg",
        "hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
        "mx-4"
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="text-lg font-bold">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
      
      <Quote className="h-8 w-8 text-primary/40 mb-4" aria-hidden="true" />
      <p className="text-muted-foreground italic">
        "{testimonial.content}"
      </p>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const scroll = () => {
      if (!containerRef.current) return;
      containerRef.current.scrollLeft += 1;
      if (
        containerRef.current.scrollLeft + containerRef.current.clientWidth >=
        containerRef.current.scrollWidth
      ) {
        containerRef.current.scrollLeft = 0;
      }
    };
    
    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className="py-20 bg-secondary/30 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <Quote 
          className="absolute text-primary/5 w-64 h-64 -left-10 -top-10 rotate-180" 
          strokeWidth={1}
          aria-hidden="true"
        />
        <Quote 
          className="absolute text-primary/5 w-64 h-64 -right-10 -bottom-10" 
          strokeWidth={1}
          aria-hidden="true"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What <span className="text-primary">People</span> Says
          </h2>
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <p className="text-muted-foreground text-lg">
            What people are saying about working with me.
          </p>
        </motion.div>
        
        <div 
          ref={containerRef}
          className="flex overflow-hidden space-x-6 py-4"
        >
          {/* Duplicate testimonials for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
