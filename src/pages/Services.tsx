import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wrench, Shield, Droplet, Clock, CheckCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: Wrench,
      title: "Installation Services",
      description: "Professional installation by certified technicians at your doorstep",
      features: [
        "Same-day installation available",
        "Complete setup and testing",
        "Free demo and training",
        "1-year installation warranty",
      ],
    },
    {
      icon: Shield,
      title: "Annual Maintenance",
      description: "Comprehensive AMC plans to keep your purifier running smoothly",
      features: [
        "Regular filter replacements",
        "Quarterly service visits",
        "Priority support",
        "Discounted spare parts",
      ],
    },
    {
      icon: Droplet,
      title: "Water Testing",
      description: "Free water quality testing to recommend the best purification solution",
      features: [
        "TDS level testing",
        "Contamination analysis",
        "Expert recommendations",
        "Detailed report provided",
      ],
    },
    {
      icon: Clock,
      title: "Repair Services",
      description: "Quick and reliable repair services for all brands",
      features: [
        "24/7 emergency support",
        "Genuine spare parts",
        "Experienced technicians",
        "90-day service warranty",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="text-lg text-blue-100">
                Complete water purification solutions with expert support
              </p>
            </motion.div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-blue-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <service.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Our expert team is ready to assist you with any service requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/contact")}
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate("/products")}
              >
                View Products
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
