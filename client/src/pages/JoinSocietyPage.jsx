
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Send,
  CheckCircle2,
} from "lucide-react";
import "./JoinSocietyPage.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  occupation: "",
  membershipType: "Volunteer",
  address: "",
  motivation: "",
};

export default function JoinSocietyPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
const [emailStatus, setEmailStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setEmailStatus("");

    try {
      const apiUrl = (
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      ).replace(/\/$/, "");

      const application = {
        name: form.fullName,
        email: form.email,
        mobile: form.phone,
        category: "General enquiry",
        message: [
          "SOCIETY MEMBERSHIP APPLICATION",
          `Membership type: ${form.membershipType}`,
          `Occupation: ${form.occupation || "Not provided"}`,
          `Address: ${form.address || "Not provided"}`,
          `Reason for joining: ${form.motivation}`,
        ].join("\n"),
        website: "",
      };

      // First save the application in MongoDB.
      const response = await fetch(`${apiUrl}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to submit your application."
        );
      }

      // Then send a notification through Formspree.
      let emailSent = false;

      try {
        const emailResponse = await fetch(
          "https://formspree.io/f/xaeqzoje",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              _subject: `New Society Application: ${form.fullName}`,
              name: form.fullName,
              email: form.email,
              phone: form.phone,
              membershipType: form.membershipType,
              occupation: form.occupation || "Not provided",
              address: form.address || "Not provided",
              motivation: form.motivation,
              source: "Join Our Society Form",
            }),
          }
        );

        emailSent = emailResponse.ok;
      } catch (emailError) {
        console.error("Formspree notification failed:", emailError);
      }

      setEmailStatus(
        emailSent
          ? "Your application was saved and the email notification was accepted by Formspree."
          : "Your application was saved, but its email notification could not be sent. Please check the Formspree configuration."
      );

      setSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      window.alert(
        error.message ||
          "We could not submit your application. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="join-society-page">
      <div className="join-society-top">
        <Link to="/" className="join-back-link">
          <ArrowLeft size={17} />
          Back to homepage
        </Link>
      </div>

      <section className="join-society-hero">
        <span className="join-society-icon">
          <Users size={30} />
        </span>

        <span className="eyebrow">BECOME PART OF OUR JOURNEY</span>

        <h1>Join Our Society</h1>

        <p>
          Share your time, skills, and ideas to support education,
          women's skill development, and community welfare.
        </p>
      </section>

      <section className="join-form-card">
        {submitted ? (
          <div className="join-success">
            <CheckCircle2 size={48} />
            <h2>Application submitted</h2>
            <p>
              Thank you for your interest in joining our society.
              Your application has been recorded for review.
            </p>
            <p role="status" aria-live="polite">
  {emailStatus}
</p>
            <Link to="/" className="join-submit-button">
              Return to homepage <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <div className="join-form-heading">
              <h2>Membership application</h2>
              <p>
                Complete the details below. Our team can review
                your interest and contact you using the information
                provided.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="join-society-form">
              <div className="join-fields-grid">
                <label>
                  Full name <span>*</span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder="Enter your full name"
                  />
                </label>

                <label>
                  Email address <span>*</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Mobile number <span>*</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    required
                    maxLength={20}
                    placeholder="Enter your mobile number"
                  />
                </label>

                <label>
                  Occupation
                  <input
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Student, professional, etc."
                  />
                </label>

                <label>
                  How would you like to participate? <span>*</span>
                  <select
                    name="membershipType"
                    value={form.membershipType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Volunteer">Volunteer</option>
                    <option value="Community supporter">
                      Community supporter
                    </option>
                    <option value="Professional contributor">
                      Professional contributor
                    </option>
                    <option value="Society membership enquiry">
                      Formal society membership enquiry
                    </option>
                  </select>
                </label>

                <label>
                  City and address
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    maxLength={250}
                    autoComplete="street-address"
                    placeholder="Your city or address"
                  />
                </label>
              </div>

              <label className="join-full-field">
                Why would you like to join? <span>*</span>
                <textarea
                  name="motivation"
                  value={form.motivation}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={1500}
                  rows={5}
                  placeholder="Tell us about your interests, skills, or how you would like to contribute."
                />
              </label>

              <p className="join-privacy-note">
                Submitting this form expresses your interest only.
                It does not automatically grant formal membership
                or confer any official position in the society.
              </p>

              <button
  type="submit"
  className="join-submit-button"
  disabled={submitting}
>
  {submitting ? "Submitting..." : "Submit application"}
  {!submitting && <Send size={17} />}
</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
