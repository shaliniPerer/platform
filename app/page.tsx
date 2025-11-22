"use client"

import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Lock,
  Users,
  Shield,
  Eye,
  BarChart3,
  Headphones,
  Award,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("Discussion")

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-32 overflow-hidden text-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Professional Investment
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Services You Can Trust
            </span>
          </h1>

          <p className="text-lg text-foreground/70 leading-relaxed">
            Secure, transparent, and efficient fund management tools designed for modern investors.
            Enterprise-grade portfolio management with real-time insights.
          </p>

          <div className="flex justify-center gap-8">
            <div>
              <p className="text-4xl font-bold text-primary">11</p>
              <p className="text-sm text-foreground/60">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">26</p>
              <p className="text-sm text-foreground/60">Expert Team</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">100+</p>
              <p className="text-sm text-foreground/60">Happy Clients</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/login">
              <Button
                size="lg"
                className="px-8 h-12 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-lg"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="px-8 h-12 border-2 border-primary text-primary hover:bg-primary/5 font-semibold bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Feature Cards */}
      <section className="py-12 px-6 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Eye, title: "Transparency", desc: "Complete visibility" },
              { icon: BarChart3, title: "High-Quality", desc: "Premium analytics" },
              { icon: Award, title: "Best Product", desc: "Industry leading" },
              { icon: Headphones, title: "Top Services", desc: "24/7 Support" },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card
                  key={i}
                  className="p-6 border border-border/50 bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-foreground/60">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* About & Why Choose Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">About Us</p>
                <h2 className="text-4xl font-bold text-foreground mb-4">Investment Excellence Redefined</h2>
              </div>

              <p className="text-lg text-foreground/70 leading-relaxed">
                InvestPro empowers investors with secure, transparent, and efficient fund management tools. We combine
                cutting-edge technology with financial expertise to deliver exceptional results.
              </p>

              <p className="text-foreground/60 leading-relaxed">
                With years of industry experience, our team is dedicated to helping you achieve your financial goals
                through intelligent portfolio management and personalized advisory services.
              </p>

              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-11">
                  Explore Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="/about.jpg"
                alt="Investment Illustration"
                className="w-full aspect-square rounded-2xl object-cover"
              />
            </div>

          </div>

          {/* Why Choose Us */}
          <div className="mt-20 grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why Choose Us</p>
              <h3 className="text-2xl font-bold text-foreground mb-6">The Best Investment Platform</h3>
              <ul className="space-y-4">
                {[
                  { icon: CheckCircle, text: "15 Years Experience" },
                  { icon: CheckCircle, text: "24/7 Support" },
                  { icon: CheckCircle, text: "Industry Certified" },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{item.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <Card className="p-8 border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Expert Advisory</h4>
                    <p className="text-sm text-foreground/60">
                      Access to seasoned investment professionals ready to guide your financial journey.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Lock className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Bank-Grade Security</h4>
                    <p className="text-sm text-foreground/60">
                      Multi-layer encryption and authentication protocols protecting your investments.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 px-6 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-foreground/60 mb-12">Our trusted partners across the financial industry</p>
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            <div className="text-2xl font-bold text-foreground/30">GlobalBank</div>
            <div className="text-2xl font-bold text-foreground/30">SecureVault</div>
            <div className="text-2xl font-bold text-foreground/30">FinanceHub</div>
            <div className="text-2xl font-bold text-foreground/30">TrustCore</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Our Services</p>
            <h2 className="text-4xl font-bold text-foreground">We Provide The Best Services</h2>
            <p className="text-foreground/60">Comprehensive investment solutions tailored to your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Security Monitoring", desc: "Real-time security alerts and fraud protection" },
              { icon: BarChart3, title: "Portfolio Analysis", desc: "In-depth performance tracking and insights" },
              { icon: TrendingUp, title: "Market Research", desc: "Expert market analysis and recommendations" },
            ].map((service, i) => {
              const Icon = service.icon
              return (
                <Card key={i} className="p-8 border border-border/50 bg-white hover:shadow-xl transition-all">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-foreground/60">{service.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Monitor Section */}
      {/* <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Eye className="w-32 h-32 text-primary/30" />
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-foreground">Monitor your Portfolio From Your Phone</h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Stay connected to your investments anytime, anywhere. Our mobile app provides full portfolio management
                capabilities with real-time notifications and updates.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground/80">Real-time market data and alerts</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground/80">Instant withdrawal requests</p>
                </div>
              </div>

              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-11">
                  Download App
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Working Process */}
      {/* <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">How It Works</p>
            <h2 className="text-4xl font-bold text-foreground">Our Working Process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "01", title: "Discussion", desc: "Understand your investment goals and preferences" },
              { number: "02", title: "Strategy", desc: "Create personalized portfolio strategy" },
              { number: "03", title: "Maintenance", desc: "Continuous monitoring and rebalancing" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <Card className="p-8 border border-border/50 bg-white text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/60">{step.desc}</p>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/3 -right-4 w-8 h-1 bg-gradient-to-r from-primary to-accent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Client Feedback</p>
            <h2 className="text-4xl font-bold text-foreground">Nothing Secures you Better Than Us</h2>
          </div>

          <Card className="p-8 lg:p-12 border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  "InvestPro has transformed how I manage my investments. The transparency and ease of use are
                  unmatched. Highly recommend to anyone serious about wealth management."
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">John Investor</p>
                    <p className="text-sm text-foreground/60">Portfolio Manager</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/90 to-primary">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Security Solutions for Your Wealth</h2>
          <p className="text-white/80 text-lg">Enterprise-grade protection for your investments</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signup">
            <Button
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 bg-transparent"
            >
              Learn More
            </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {/* <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Latest Updates</p>
            <h2 className="text-4xl font-bold text-foreground">Blog & Articles</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Investment Security", desc: "Learn about our latest security measures" },
              { title: "Market Analysis", desc: "Weekly insights and market trends" },
              { title: "Portfolio Tips", desc: "Expert advice on portfolio management" },
            ].map((article, i) => (
              <Card key={i} className="overflow-hidden border border-border/50 hover:shadow-lg transition-all">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <BarChart3 className="w-16 h-16 text-primary/30" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{article.title}</h3>
                  <p className="text-foreground/60 mb-4">{article.desc}</p>
                  <Link href="#" className="text-primary font-semibold hover:text-primary/80">
                    Read More →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter */}
      {/* <section className="py-20 px-6 bg-white border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary uppercase tracking-widest">Stay Updated</p>
              <h2 className="text-3xl font-bold text-foreground">Our Newsletter</h2>
              <p className="text-foreground/60">
                Get the latest investment tips and market insights delivered to your inbox.
              </p>
            </div>

            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">Subscribe Now</Button>
            </form>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-primary bg-primary text-white py-12 px-6">
  <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8 mb-8">

      {/* Branding */}
      <div>
        <p className="text-lg font-bold text-white mb-2">InvestPro</p>
        <p className="text-white/80 text-sm">
          Smart and secure investment management platform for investors.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <p className="font-semibold text-white mb-3">Quick Links</p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/auth/login" className="hover:text-white transition">
              Login
            </Link>
          </li>
          <li>
            <Link href="/auth/signup" className="hover:text-white transition">
              Register
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Contact */}
      <div>
        <p className="font-semibold text-white mb-3">Contact</p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>Email: support@investpro.com</li>
          <li>Phone: +94 77 123 4567</li>
          <li>Location: Colombo, Sri Lanka</li>
        </ul>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between">
      <p className="text-sm text-white/80">© 2025 InvestPro. All rights reserved.</p>
      <p className="text-sm text-white/80 mt-4 md:mt-0">Secure • Transparent • Professional</p>
    </div>
  </div>
</footer>

    </div>
  )
}
