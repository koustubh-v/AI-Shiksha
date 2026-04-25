import { Link } from "react-router-dom";
import MarketingLayout from "@/components/marketing/MarketingLayout";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out LearnAI",
      price: "₹0",
      period: "forever",
      features: [
        "Up to 3 courses",
        "Basic AI Tutor",
        "Community support",
        "Basic analytics",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "For serious educators and learners",
      price: "₹29",
      period: "per month",
      features: [
        "Unlimited courses",
        "Advanced AI Tutor",
        "Priority support",
        "Advanced analytics",
        "AI course creation",
        "Custom branding",
        "Revenue share: 10%",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For institutions and teams",
      price: "Custom",
      period: "per year",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "SSO/SAML integration",
        "Custom AI training",
        "API access",
        "SLA guarantee",
        "Revenue share: 5%",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I switch plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Pro plan comes with a 14-day free trial. No credit card required.",
    },
    {
      question: "What's the revenue share model?",
      answer: "When you sell courses on our platform, we take a small percentage of each sale. Free plan is 20%, Pro is 10%, and Enterprise is 5%.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.",
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes! We offer 50% off for verified non-profit organizations. Contact our sales team to learn more.",
    },
  ];

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lms-emerald-light text-lms-emerald text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative bg-card border rounded-xl p-8",
                  plan.popular
                    ? "border-lms-blue shadow-lg scale-105"
                    : "border-border"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-lms-blue text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-lms-emerald shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                  <Button
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "bg-lms-blue hover:bg-lms-blue/90"
                        : ""
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-lms-navy">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-white/70 mb-6">
            Our team is here to help you find the right plan.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
