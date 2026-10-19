
import { useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import "./EnquiryForm.css";

const initialForm = {
  name: "",
  email: "",
  mobile: "",
  category: "General enquiry",
  message: "",
  website: "",
};

const categories = [
  "General enquiry",
  "Education & scholarships",
  "Samuhik Vivah",
  "Women's skill training",
  "Volunteering",
  "Documentation & transparency",
  "Other",
];

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function EnquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (result) setResult(null);
  }

  
  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setResult(null);

    let savedToDatabase = false;

    try {
      // First, save the enquiry to your existing MongoDB backend.
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit your enquiry.");
      }

      savedToDatabase = true;

      // Then send the email notification through Formspree.
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
              _subject: `NGO Enquiry: ${form.category}`,
              name: form.name,
              email: form.email,
              mobile: form.mobile,
              category: form.category,
              message: form.message,
              source: "Website Enquiry Form",
            }),
          }
        );

        emailSent = emailResponse.ok;
      } catch (emailError) {
        console.error("Formspree notification failed:", emailError);
      }

      setResult({
        type: "success",
        message: emailSent
          ? "Your enquiry has been saved and the email notification was accepted by Formspree."
          : "Your enquiry has been saved, but the email notification could not be sent. Please contact the society directly if your enquiry is urgent.",
        emailSent,
        reference: data.reference,
      });

      setForm(initialForm);
    } catch (error) {
      setResult({
        type: "error",
        message: savedToDatabase
          ? "Your enquiry was saved, but an additional step failed. Please check the notification status before trying again."
          : error.message ||
            "We could not connect to the enquiry service. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="enquiry-panel">
      <div className="enquiry-heading">
        <span className="enquiry-eyebrow">WE'RE HERE TO HELP</span>
        <h3>Send us an enquiry</h3>
        <p>
          Have a question about our programmes or society? Send us a message
          and our team can follow up using the contact details you provide.
        </p>
      </div>

      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="enquiry-fields">
          <label>
            Full name <span aria-hidden="true">*</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
              placeholder="Enter your full name"
            />
          </label>

          <label>
            Email address <span aria-hidden="true">*</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              maxLength={254}
              required
              placeholder="you@example.com"
            />
          </label>

          <label>
            Mobile number <span aria-hidden="true">*</span>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              autoComplete="tel"
              inputMode="tel"
              pattern="[+()0-9 -]{7,20}"
              maxLength={20}
              required
              placeholder="Enter your mobile number"
            />
          </label>

          <label>
            Enquiry category <span aria-hidden="true">*</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="enquiry-message-field">
            Your message <span aria-hidden="true">*</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              minLength={10}
              maxLength={3000}
              rows={5}
              required
              placeholder="Please tell us how we can help (at least 10 characters)."
            />
            <small>{form.message.length}/3000 characters</small>
          </label>

          {/* Honeypot for basic bot filtering; real visitors leave this empty. */}
          <div className="enquiry-honeypot" aria-hidden="true">
            <label>
              Leave this field empty
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
        </div>

        <button
          className="enquiry-submit"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <LoaderCircle size={18} className="enquiry-spinner" />
              Sending enquiry...
            </>
          ) : (
            <>
              Send enquiry <Send size={17} />
            </>
          )}
        </button>

        <p className="enquiry-privacy">
          Your details will be used to respond to this enquiry. Please don't
          include passwords, financial account details, or other sensitive
          information.
        </p>

        {result && (
          <div
            className={`enquiry-result enquiry-result-${result.type}`}
            role={result.type === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {result.type === "success" && <CheckCircle2 size={20} />}
            <div>
              <strong>
                {result.type === "success"
                  ? "Enquiry recorded"
                  : "Submission unsuccessful"}
              </strong>
              <p>{result.message}</p>
              {result.type === "success" && result.reference && (
                <small>Reference: {result.reference}</small>
              )}
              {result.type === "success" && !result.emailSent && (
                <small>
                  Your enquiry has been saved, but the email notification
                  needs attention.
                </small>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
