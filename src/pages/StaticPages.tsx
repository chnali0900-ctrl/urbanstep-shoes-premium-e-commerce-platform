import React from 'react';
const Container = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="max-w-3xl mx-auto px-4 py-20">
    <h1 className="text-4xl font-bold mb-10 tracking-tight">{title}</h1>
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
      {children}
    </div>
  </div>
);
export function AboutPage() {
  return (
    <Container title="Our Story">
      <p className="text-lg leading-relaxed text-muted-foreground">
        Born in the heart of the city, UrbanStep was created for those who see the sidewalk as a runway and the city streets as their playground. 
        We believe that footwear should never compromise—giving you the performance of an athlete with the style of a tastemaker.
      </p>
      <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" className="w-full h-80 object-cover rounded-2xl my-8" alt="About" />
      <h2 className="text-2xl font-bold">Our Philosophy</h2>
      <p className="text-muted-foreground">
        Sustainability, durability, and innovation. Every pair of UrbanStep shoes is crafted using premium materials sourced ethically, 
        ensuring that your footprint on the planet is as light as your step.
      </p>
    </Container>
  );
}
export function ContactPage() {
  return (
    <Container title="Contact Us">
      <p className="text-muted-foreground text-lg">
        Have questions about sizing, shipping, or just want to say hello? Our team is here to help.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="p-6 bg-muted rounded-2xl">
          <h3 className="font-bold mb-2">Customer Service</h3>
          <p className="text-sm text-muted-foreground">Email: support@urbanstep.com</p>
          <p className="text-sm text-muted-foreground">Phone: +1 (555) 123-4567</p>
        </div>
        <div className="p-6 bg-muted rounded-2xl">
          <h3 className="font-bold mb-2">Headquarters</h3>
          <p className="text-sm text-muted-foreground">123 Fashion District</p>
          <p className="text-sm text-muted-foreground">New York, NY 10001</p>
        </div>
      </div>
    </Container>
  );
}
export function PrivacyPage() {
  return (
    <Container title="Privacy Policy">
      <p className="text-muted-foreground">
        Your privacy is critically important to us. At UrbanStep, we have a few fundamental principles:
      </p>
      <ul className="list-disc pl-5 text-muted-foreground space-y-4">
        <li>We don't ask you for personal information unless we truly need it.</li>
        <li>We don't share your personal information with anyone except to comply with the law, develop our products, or protect our rights.</li>
        <li>We don't store personal information on our servers unless required for the on-going operation of one of our services.</li>
      </ul>
    </Container>
  );
}