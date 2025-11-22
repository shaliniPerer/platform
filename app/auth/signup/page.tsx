"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { User, Mail, Phone, Lock, ArrowLeft, FileUp, MapPin } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    address: "",
    district: "",
    province: "",
    postalCode: "",
    phone: "",
    email: "",
    plan: "",
    amount: "",
    bankName: "",
    accountNo: "",
    branchName: "",
    nicFile: null as File | null,
    bankBookFile: null as File | null,
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any
    if (files) {
      setFormData({ ...formData, [name]: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // basic validation
  for (const key in formData) {
    if (
      key !== "nicFile" &&
      key !== "bankBookFile" &&
      (formData as any)[key] === ""
    ) {
      setError("Please fill in all fields");
      return;
    }
  }

  if (!formData.nicFile || !formData.bankBookFile) {
    setError("Please upload NIC and Bank Book files");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  // Create FormData and append all fields
  const form = new FormData();
  Object.keys(formData).forEach((key) => {
    form.append(key, (formData as any)[key]);
  });

  try {
    const res = await fetch("/api/investor/signup", {

      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    // Signup success
    router.push("/auth/login");
  } catch (err) {
    setError("Something went wrong. Try again.");
  }
};



  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="p-8 space-y-6">
          <h1 className="text-2xl font-bold">Create Investor Account</h1>
          <p className="text-muted-foreground">Fill all required details to register.</p>

          {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
            </div>

            {/* NIC */}
            <div>
              <label className="text-sm font-medium">National Identity Card No</label>
              <Input name="nic" value={formData.nic} onChange={handleChange} placeholder="123456789V" />
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Permanent Address
              </label>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="123, Main Street" />
            </div>

            {/* District */}
            <div>
              <label className="text-sm font-medium">District</label>
              <Input name="district" value={formData.district} onChange={handleChange} placeholder="Colombo" />
            </div>

            {/* Province */}
            <div>
              <label className="text-sm font-medium">Province</label>
              <Input name="province" value={formData.province} onChange={handleChange} placeholder="Western" />
            </div>

            {/* Postal Code */}
            <div>
              <label className="text-sm font-medium">Postal Code</label>
              <Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="10100" />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact Number
              </label>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+94 71 234 5678" />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-mail
              </label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@example.com" />
            </div>

            {/* Investment Plan */}
            <div>
              <label className="text-sm font-medium">Investment Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select Plan</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="48">48 Months</option>
              </select>
            </div>

            {/* Investment Amount */}
            <div>
              <label className="text-sm font-medium">Investing Amount (LKR)</label>
              <Input name="amount" value={formData.amount} onChange={handleChange} placeholder="50000" />
            </div>

            {/* Bank Info */}
            <div>
              <label className="text-sm font-medium">Bank Name</label>
              <Input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="BOC / HNB / Commercial" />
            </div>

            <div>
              <label className="text-sm font-medium">Account Number</label>
              <Input name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="1234567890" />
            </div>

            <div>
              <label className="text-sm font-medium">Branch Name</label>
              <Input name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Colombo Fort" />
            </div>

            {/* File Uploads */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <FileUp className="w-4 h-4" /> Upload NIC (png / jpg / jpeg)
              </label>
              <Input type="file" name="nicFile" accept=".png,.jpg,.jpeg" onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <FileUp className="w-4 h-4" /> Upload Bank Book (png / jpg / jpeg)
              </label>
              <Input type="file" name="bankBookFile" accept=".png,.jpg,.jpeg" onChange={handleChange} />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" /> Confirm Password
              </label>
              <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full">Create Account</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
